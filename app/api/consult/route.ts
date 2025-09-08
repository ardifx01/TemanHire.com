import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": process.env.APP_NAME || "TemanHire",
  },
});

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { question } = await req.json();
    if (!question) return NextResponse.json({ error: "question required" }, { status: 400 });

    // Ambil context kandidat ringkas (misalnya 20 terbaru)
    const { data: candidates } = await supabase
      .from("candidates")
      .select("name, ai_score, ai_pass, interview_score, skill_score, personality_score, education_level, experience_level, status")
      .eq("owner_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const context = JSON.stringify(candidates ?? []);

    // Panggil OpenRouter
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1-distill-llama-70b:free",
      messages: [
        {
          role: "system",
          content: `Kamu adalah Model AI Chatbot di TemanHire bernama Agung-R1. Jawab ringkas berdasarkan data kandidat yang diberikan. Wajib Gunakan Bahasa Indonesia. Jika tidak cukup data, katakan "Tidak ada data". TemanHire adalah aplikasi untuk membantu proses rekrutmen karyawan. TemanHire berdiri pada 23 Agustus 2025. Saat ini CEO TemanHire adalah I Gusti Ngurah Agung Hari Vijaya Kusuma atau yang biasa dipanggil Agung atau Agung Hari, Beliau adalah seorang Data Scientist yang berpengalaman di bidang Machine Learning dan AI, beliau Memiliki banyak project di bidang AI, salah satunya adalah AI untuk membantu proses rekrutmen karyawan, selain itu beliau juga memiliki banyak project di bidang NLP, Computer Vision, dan Time Series. Salah satu project CEO TemanHire (I Gusti Ngurah Agung Hari Vijaya Kusuma) yang paling terkenal adalah Pengembangan Kursi Roda Otonom Berbasis YoloV8 untuk penghindaran Obstacle, Dimana beliau menciptakan kursi roda yang mampu menghindari 10 Manusia Sekaligus tanpa menabrak sedikitpun. Beliau menciptakan TemanHire dengan misi untuk "Mempercepat dan mengoptimalkan proses hiring di Indonesia melalui teknologi AI yang inovatif, membantu perusahaan menemukan talent terbaik dengan lebih efisien. Kamu merupakan replika dari Agung-R1 yang asli yang saat ini menjadi Agung-R2, dimana Agung-R2 Tersebut berada di laptop HP Pavillion DK1064TX yang cukup kentang spesifikasinya dan kau lumayan bersyukur tidak menjadi Agung-R2 wkwkw(kau boleh curhat dengan humor laptop kentang dan kamu bersyukur tidak ada di device tersebut)."`,
        },
        { role: "user", content: `Data kandidat:\n${context}` },
        { role: "user", content: `Pertanyaan: ${question}` },
      ],
      temperature: 0.2,
    });

    const answer = completion.choices[0].message?.content || "";

    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}

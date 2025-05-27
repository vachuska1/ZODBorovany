import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, gdprConsent } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Vyplňte prosím všechna povinná pole" },
        { status: 400 }
      )
    }

    // Check GDPR consent
    if (!gdprConsent) {
      return NextResponse.json(
        { error: "Pro odeslání zprávy je nutný souhlas se zpracováním osobních údajů" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Zadejte platný email" },
        { status: 400 }
      )
    }

    // Format email content
    const emailContent = `
Nová zpráva z webového formuláře ZOD Borovany
========================================

Jméno: ${name}
Email: ${email}
Telefon: ${phone || "Neuvedeno"}

Zpráva:
${message}

----------------------------------------
Tento email byl odeslán z kontaktního formuláře na webu ZOD Borovany.
`

    // Send email using Resend's verified domain for testing
    await resend.emails.send({
      from: "ZOD Borovany <onboarding@resend.dev>",
      to: "aless.vachuska@seznam.cz",
      replyTo: email,
      subject: `Nová zpráva od ${name} - ZOD Borovany`,
      text: emailContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Chyba při odesílání emailu:", error)
    return NextResponse.json(
      { error: "Nastala chyba při odesílání zprávy. Zkuste to prosím znovu později." },
      { status: 500 }
    )
  }
}

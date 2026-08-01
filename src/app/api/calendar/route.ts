import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });
const resend = new Resend(process.env.RESEND_API_KEY);

const CHAUFFEUR_EMAIL = "gstransport974@gmail.com";
const FROM_EMAIL = "GS Transport <reservation@gstransport.re>";

const MOIS_LONG_FR = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function formatDateFrEmail(dateStr: string, time: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return `${d} ${MOIS_LONG_FR[mo - 1]} ${y} à ${time}`;
}

function emailClient(data: {
  firstName: string; lastName: string; phone: string; email: string;
  pickup: string; destination: string; tripType: string;
  departDate: string; departTime: string;
  retourDate?: string; retourTime?: string;
  prix: number;
}) {
  const tripLabel = data.tripType === "AR" ? "Aller-retour" : "Aller simple";
  const departStr = formatDateFrEmail(data.departDate, data.departTime);
  const retourStr = data.retourDate && data.retourTime ? formatDateFrEmail(data.retourDate, data.retourTime) : null;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(9,20,36,0.08);">

        <!-- Header -->
        <tr><td style="background:#091424;padding:40px 48px;">
          <p style="margin:0 0 24px;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#1FA3BA;">GS Transport · Réunion</p>
          <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;color:#ffffff;line-height:1.2;">Demande de réservation<br>reçue ✓</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;">Sébastien va vous confirmer par téléphone dans les 15 minutes.</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#1FA3BA;">Bonjour ${data.firstName},</p>
          <p style="margin:0 0 32px;font-size:15px;color:rgba(9,20,36,0.6);line-height:1.6;">Votre demande de course a bien été enregistrée. Voici le récapitulatif :</p>

          <!-- Bloc client -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(9,20,36,0.08);border-radius:12px;overflow:hidden;margin-bottom:16px;">
            <tr><td style="padding:16px 20px;background:rgba(9,20,36,0.03);">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Client</p>
              <p style="margin:0;font-size:15px;font-weight:500;color:#091424;">${data.firstName} ${data.lastName}</p>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(9,20,36,0.5);">${data.phone}</p>
            </td></tr>
          </table>

          <!-- Bloc trajet -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(9,20,36,0.08);border-radius:12px;overflow:hidden;margin-bottom:16px;">
            <tr><td style="padding:16px 20px;border-bottom:1px solid rgba(9,20,36,0.06);">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Type de trajet</p>
              <p style="margin:0;font-size:14px;font-weight:500;color:#091424;">${tripLabel} · SUV Premium</p>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid rgba(9,20,36,0.06);">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Départ</p>
              <p style="margin:0;font-size:14px;color:#091424;">${data.pickup}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid rgba(9,20,36,0.06);">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Destination</p>
              <p style="margin:0;font-size:14px;color:#091424;">${data.destination}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;${retourStr ? "border-bottom:1px solid rgba(9,20,36,0.06);" : ""}">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Date aller</p>
              <p style="margin:0;font-size:14px;color:#091424;">${departStr}</p>
            </td></tr>
            ${retourStr ? `<tr><td style="padding:16px 20px;">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Date retour</p>
              <p style="margin:0;font-size:14px;color:#091424;">${retourStr}</p>
            </td></tr>` : ""}
          </table>

          <!-- Prix -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#091424;border-radius:12px;overflow:hidden;margin-bottom:32px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Estimation tarifaire</p>
              <p style="margin:0;font-size:36px;font-weight:300;color:#ffffff;">${data.prix} €</p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);">Paiement à bord · Tarif estimatif</p>
            </td></tr>
          </table>

          <p style="margin:0 0 8px;font-size:13px;color:rgba(9,20,36,0.5);line-height:1.6;">Des questions ? Contactez Sébastien directement :</p>
          <p style="margin:0;font-size:15px;font-weight:500;color:#1FA3BA;">📞 +262 692 XX XX XX</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;border-top:1px solid rgba(9,20,36,0.06);background:rgba(9,20,36,0.02);">
          <p style="margin:0;font-size:12px;color:rgba(9,20,36,0.35);line-height:1.6;">GS Transport · Chauffeur privé à La Réunion<br>Ce mail est une confirmation automatique — répondez à votre chauffeur directement par téléphone.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function emailChauffeur(data: {
  firstName: string; lastName: string; phone: string; email: string;
  pickup: string; destination: string; tripType: string;
  departDate: string; departTime: string;
  retourDate?: string; retourTime?: string;
  prix: number;
}) {
  const tripLabel = data.tripType === "AR" ? "Aller-retour" : "Aller simple";
  const departStr = formatDateFrEmail(data.departDate, data.departTime);
  const retourStr = data.retourDate && data.retourTime ? formatDateFrEmail(data.retourDate, data.retourTime) : null;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(9,20,36,0.08);">

        <!-- Header -->
        <tr><td style="background:#1FA3BA;padding:32px 48px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.7);">Nouvelle réservation</p>
          <h1 style="margin:0;font-size:24px;font-weight:400;color:#ffffff;">🚗 ${data.firstName} ${data.lastName}</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 48px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(9,20,36,0.1);border-radius:12px;overflow:hidden;margin-bottom:20px;">
            <tr style="background:rgba(9,20,36,0.03);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);width:140px;">Client</td>
              <td style="padding:14px 18px;font-size:14px;font-weight:600;color:#091424;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Téléphone</td>
              <td style="padding:14px 18px;font-size:14px;font-weight:600;color:#1FA3BA;">${data.phone}</td>
            </tr>
            <tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Email</td>
              <td style="padding:14px 18px;font-size:14px;color:#091424;">${data.email}</td>
            </tr>
            <tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Type</td>
              <td style="padding:14px 18px;font-size:14px;color:#091424;">${tripLabel}</td>
            </tr>
            <tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Départ</td>
              <td style="padding:14px 18px;font-size:14px;color:#091424;">${data.pickup}</td>
            </tr>
            <tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Destination</td>
              <td style="padding:14px 18px;font-size:14px;color:#091424;">${data.destination}</td>
            </tr>
            <tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Date aller</td>
              <td style="padding:14px 18px;font-size:14px;font-weight:600;color:#091424;">${departStr}</td>
            </tr>
            ${retourStr ? `<tr style="border-top:1px solid rgba(9,20,36,0.06);">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(9,20,36,0.4);">Date retour</td>
              <td style="padding:14px 18px;font-size:14px;font-weight:600;color:#091424;">${retourStr}</td>
            </tr>` : ""}
            <tr style="border-top:1px solid rgba(9,20,36,0.06);background:#091424;">
              <td style="padding:14px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.5);">Estimation</td>
              <td style="padding:14px 18px;font-size:18px;font-weight:300;color:#ffffff;">${data.prix} €</td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 48px 32px;">
          <p style="margin:0;font-size:12px;color:rgba(9,20,36,0.35);">Demande reçue via gstransport.re · L'événement a été ajouté à votre Google Calendar.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, phone, email,
      pickup, destination, tripType, vehicle,
      departDatetime, retourDatetime, prix,
    } = body;

    // ── Google Calendar ──
    const [departDate, departTime] = departDatetime.split(" à ");
    const [hour, minute] = departTime.split(":");
    const startTime = new Date(`${departDate}T${hour.padStart(2,"0")}:${minute.padStart(2,"0")}:00+04:00`);
    const endTime   = new Date(startTime.getTime() + 60 * 60 * 1000);

    const vehicleLabel = vehicle === "suv" ? "SUV Premium 4 places" : "Van Premium 8 places";
    const tripLabel    = tripType === "AR" ? "Aller-retour" : "Aller simple";

    let description = `👤 Client : ${firstName} ${lastName}\n📞 Téléphone : ${phone}\n📧 Email : ${email}\n\n🚗 Type : ${tripLabel}\n🚙 Véhicule : ${vehicleLabel}\n\n📍 Départ : ${pickup}\n🏁 Destination : ${destination}\n\n💶 Estimation : ${prix} €`;
    if (tripType === "AR" && retourDatetime) description += `\n\n🔄 Retour : ${retourDatetime}`;

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `🚗 Course GS Transport — ${firstName} ${lastName}`,
        description,
        start: { dateTime: startTime.toISOString(), timeZone: "Indian/Reunion" },
        end:   { dateTime: endTime.toISOString(),   timeZone: "Indian/Reunion" },
        colorId: "7",
      },
    });

    // ── Emails ──
    const [retourDate, retourTime] = retourDatetime ? retourDatetime.split(" à ") : [undefined, undefined];

    const emailData = {
      firstName, lastName, phone, email,
      pickup, destination, tripType,
      departDate, departTime,
      retourDate, retourTime,
      prix,
    };

    await Promise.all([
      // Email chauffeur
      resend.emails.send({
        from: FROM_EMAIL,
        to: CHAUFFEUR_EMAIL,
        subject: `🚗 Nouvelle réservation — ${firstName} ${lastName} · ${departDatetime}`,
        html: emailChauffeur(emailData),
      }),
      // Email client (seulement si email fourni)
      ...(email ? [resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Votre demande de réservation GS Transport — ${departDatetime}`,
        html: emailClient(emailData),
      })] : []),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Calendar/email error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

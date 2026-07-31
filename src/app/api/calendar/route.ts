import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      pickup,
      destination,
      tripType,
      vehicle,
      departDatetime,
      retourDatetime,
      prix,
    } = body;

    const [date, time] = departDatetime.split(" à ");
    const [day, month, year] = date.split("/");
    const [hour, minute] = time.split(":");

    const startTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const vehicleLabel = vehicle === "suv" ? "SUV Premium 4 places" : "Van Premium 8 places";
    const tripLabel = tripType === "AR" ? "Aller-retour" : "Aller simple";

    let description = `👤 Client : ${firstName} ${lastName}\n📞 Téléphone : ${phone}\n\n🚗 Type : ${tripLabel}\n🚙 Véhicule : ${vehicleLabel}\n\n📍 Départ : ${pickup}\n🏁 Destination : ${destination}\n\n💶 Estimation : ${prix} €`;

    if (tripType === "AR" && retourDatetime) {
      description += `\n\n🔄 Retour : ${retourDatetime}`;
    }

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `🚗 Course GS Transport — ${firstName} ${lastName}`,
        description,
        start: { dateTime: startTime.toISOString(), timeZone: "Indian/Reunion" },
        end: { dateTime: endTime.toISOString(), timeZone: "Indian/Reunion" },
        colorId: "7",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Calendar error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

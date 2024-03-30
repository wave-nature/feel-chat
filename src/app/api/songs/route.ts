import YTMusic from "ytmusic-api";
import ytdl from "ytdl-core";

export async function POST(request: Request) {
  const ytmusic = new YTMusic();
  await ytmusic.initialize(/* Optional: Custom cookies */);

  const body = await request.json();

  let songs =
    (await ytmusic.search(body?.song || "Never gonna give you up")) || [];

  songs = songs.filter((song: any) => song?.videoId);

  const songsWithMusic = await Promise.all(
    songs.map(async (song: any) => {
      const videoInfo = await ytdl.getInfo(song?.videoId);
      const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
      const streams = audioFormats.map((format) => format.url);
      return { ...song, streams };
    })
  );

  return Response.json({
    status: true,
    songs: songsWithMusic,
  });
}

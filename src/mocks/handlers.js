import { http, HttpResponse } from "msw";
const CookieString = `userToken=13G51U6GKH7342K7JSDGJK; Path=/; HttpOnly; Sequre=False; SameSite=Lax; Max-Age=86400`
export const handlers = [
  http.post("https://devmode/Registr/", () => {
    return new HttpResponse(null,{
      headers:{
        'set-cookie': CookieString,
      },
    }, { status: 201 });
  }),
  http.get("https://devmode/myurls/", () => {
    return HttpResponse.json([
      {
        shortUrl: "https://ele.com/sfh79",
        longUrl: "https://tube.com",
        urlTime: 20000,
        urlClicks: "unlimited",
      },
      {
        shortUrl: "https://examom/satq3t821",
        longUrl: "https://gooe.com",
        urlTime: 3579,
        urlClicks: 100000,
      },
      {
        shortUrl: "https://exa.com/satq3t82",
        longUrl: "https://google.com",
        urlTime: 3579,
        urlClicks: 100000,
      },
      {
        shortUrl: "https://xamlcom/satq3t82",
        longUrl: "https://googcom",
        urlTime: 3579,
        urlClicks: 100000,
      },
      {
        shortUrl: "https://exacom/satq3t8",
        longUrl: "https://google.com",
        urlTime: 3579,
        urlClicks: 100000,
      },
      {
        shortUrl: "https://examle.com/satq3",
        longUrl: "https://gogle.com",
        urlTime: 3579,
        urlClicks: 100000,
      },
      
    ],{ status: 200 });
  }),
  http.post("https://devmode/ShortUrl/", () => {
    return new HttpResponse("Hw81kOM", { status: 201 });
  }),
];

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
        createdAt: "2024-01-15T10:30:00Z",
        expiredAt:"2024-03-10T14:00:00Z", 
        urlClicks: 124,
      },
      {
        shortUrl: "https://examom/satq3t821",
        longUrl: "https://gooe.com",
        createdAt: "2024-02-01T09:00:00Z",
        expiredAt: "2024-03-05T17:00:00Z",
        urlClicks: 132,
      },
      {
        shortUrl: "https://exa.com/satq3t82",
        longUrl: "https://google.com",
        createdAt: "2025-09-14T08:00:00Z",
        expiredAt: "2025-09-15T12:00:00Z",
        urlClicks: 10,
      },
      {
        shortUrl: "https://xamlcom/satq3t82",
        longUrl: "https://googcom",
        createdAt: "2025-09-13T16:00:00Z",
        expiredAt: "2025-09-25T16:00:00Z",
        urlClicks: 5757,
      },
      {
        shortUrl: "https://exacom/satq3t8",
        longUrl: "https://google.com",
        createdAt: "2025-09-12T09:30:00Z",
        expiredAt: "2025-09-22T09:30:00Z",
        urlClicks: 10240,
      },
      {
        shortUrl: "https://examle.com/satq3",
        longUrl: "https://gogle.com",
        createdAt: "2025-09-05T00:00:00Z",
        expiredAt: "2025-09-28T00:00:00Z",
        urlClicks: 100000,
      },
      
    ],{ status: 200 });
  }),
  http.post("https://devmode/ShortUrl/", () => {
    return new HttpResponse("Hw81kOM", { status: 201 });
  }),
];

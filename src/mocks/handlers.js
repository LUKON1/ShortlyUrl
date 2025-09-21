import { http, HttpResponse } from "msw";
export const handlers = [
  http.post("https://devmode/registr", () => {
    return HttpResponse.json({accesToken:"as2g24hgadsgej", user: "LUKONDEV"}, { status: 201 });
  }),
  http.post("https://devmode/signin", () => {
    return HttpResponse.json({accesToken:"as2g24hgadsgej", user: "LUKONDEV"}, { status: 201 });
  }),
  http.get("https://devmode/myurls", () => {
    return HttpResponse.json([
      {
        shortUrl: "https://ele.com/sfh79",
        longUrl: "https://tube.com",
        createdAt: "2024-01-15T10:30:00Z",
        expiredAt:"2024-03-10T14:00:00Z", 
        urlClicks: 124,
        id: 1
      },
      {
        shortUrl: "https://examom/satq3t821",
        longUrl: "https://gooe.com",
        createdAt: "2024-02-01T09:00:00Z",
        expiredAt: "2024-03-05T17:00:00Z",
        urlClicks: 132,
        id: 2
      },
      {
        shortUrl: "https://exa.com/satq3t82",
        longUrl: "https://google.com",
        createdAt: "2025-09-14T08:00:00Z",
        expiredAt: "2025-09-15T12:00:00Z",
        urlClicks: 10,
        id: 3
      },
      {
        shortUrl: "https://xamlcom/satq3t82",
        longUrl: "https://googcom",
        createdAt: "2025-09-13T16:00:00Z",
        expiredAt: "2025-09-25T16:00:00Z",
        urlClicks: 5757,
        id: 4
      },
      {
        shortUrl: "https://exacom/satq3t8",
        longUrl: "https://google.com",
        createdAt: "2025-09-12T09:30:00Z",
        expiredAt: "2025-09-22T09:30:00Z",
        urlClicks: 10240,
        id: 5
      },
      {
        shortUrl: "https://examle.com/satq3",
        longUrl: "https://messanger.max",
        createdAt: "2025-09-05T00:00:00Z",
        expiredAt: "2025-09-28T00:00:00Z",
        urlClicks: 100000,
        id: 6
      },
      {
        shortUrl: "https://xamlcom/satq3t82",
        longUrl: "https://tumtum.goo",
        createdAt: "2025-09-13T16:00:00Z",
        expiredAt: "2025-09-25T16:00:00Z",
        urlClicks: 5757,
        id: 7
      },
      
      
    ],{ status: 200 });
  }),
  http.post("https://devmode/shorter", () => {
    return HttpResponse.json({usercode : "Hw81kOM"}, { status: 201 });
  }),
];

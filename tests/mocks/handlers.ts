import { http, HttpResponse } from "msw";
import { db } from "./db";

export const handlers = [
  ...db.product.toHandlers("rest"),

  http.get("/products/:id", ({ params }) => {
    const id: string | readonly string[] = params.id;
    const product = db.product.findFirst({
      where: { id: { equals: parseInt(id.toString()) } },
    });

    return HttpResponse.json(product);
  }),

  http.get("/products",()=>{
    const products = db.product.getAll();
    return HttpResponse.json(products);
  })
];

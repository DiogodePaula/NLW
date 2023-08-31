import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectURL = new URL("/", req.url);

  return NextResponse.redirect(redirectURL, {
    headers: {
      // salvando o token nos cookies
      "Set-Cookie": `token=; Path=/; max-age=0`,
    },
  });
}
// para remover um cookie basta nao passar nenhum valor para ele e zerar o max-age

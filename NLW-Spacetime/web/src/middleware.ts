import { NextRequest, NextResponse } from "next/server";

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.redirect(signInURL, {
      headers: {
        // salvando o token nos cookies
        "Set-Cookie": `redirectTo=${req.url}; Path=/; HttpOnly; max-age=20`,
      },
    }); // nao existe token redireciona ele

  return NextResponse.next(); // existe token segue normalmente
}

export const config = {
  matcher: "/memories/:path*",
};

// No NextJS temos o back-end for front-end para poder realizar acoes que normalmente
// nao poderiam ser realizadas no front

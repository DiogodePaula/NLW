import Image from "next/image";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";

import { api } from "@/lib/api";
import { EmptyMemories } from "@/components/EmptyMemories";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Typescript + JSX = TSX
// JSX = Javascript + XML
// XML = HTML
dayjs.locale(ptBr);
interface Memory {
  id: string;
  coverUrl: string;
  excerpt: string;
  createdAt: string;
}

export default async function Home() {
  const isAuthenticated = cookies().has("token");

  if (!isAuthenticated) {
    return <EmptyMemories />;
  }

  const token = cookies().get("token")?.value;

  const response = await api.get("/memories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  response.data = [
    {
      id: "1234",
      coverUrl: "https://via.placeholder.com/1920x1080",
      excerpt:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus reiciendis consequuntur laborum dolore accusantium maiores nesciunt corporis eos. Laudantium reprehenderit, facere quo repellendus consequuntur a quia nesciunt fuga sapiente eligendi!",
      createdAt: "2023-09-03",
    },
    {
      id: "12345",
      coverUrl: "https://via.placeholder.com/1920x1080",
      excerpt:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus reiciendis consequuntur laborum dolore accusantium maiores nesciunt corporis eos. Laudantium reprehenderit, facere quo repellendus consequuntur a quia nesciunt fuga sapiente eligendi!",
      createdAt: "2023-09-03",
    },
    {
      id: "1345",
      coverUrl: "https://via.placeholder.com/1920x1080",
      excerpt:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus reiciendis consequuntur laborum dolore accusantium maiores nesciunt corporis eos. Laudantium reprehenderit, facere quo repellendus consequuntur a quia nesciunt fuga sapiente eligendi!",
      createdAt: "2023-09-03",
    },
  ];

  const memories: Memory[] = response.data;

  if (!memories.length) {
    return <EmptyMemories />;
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
            </time>
            <Image
              src={memory.coverUrl}
              width={600}
              height={200}
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>
            <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// O NextJS permite que nos componentes em que nao tenha o 'use client' eu
// defina o componente como assíncrono e faca as chamadas http dentro dele

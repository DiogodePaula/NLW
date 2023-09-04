"use client"; //necessário para quando a pagina for executar acoes, o NextJS envia toda
// a pagina com js para o navegador
import { ChangeEvent, useState } from "react";

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }
    // preview de video segue a mesma logica
    const previewURL = URL.createObjectURL(files[0]);
    setPreview(previewURL);
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverURL"
        type="file"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  );
}

// use client = quando for necessário criar um componente que executara as acoes desejadas
// assim evitando de enviar código desnecessário para o navegador, encapsular o componente
// que vai ter reatividade o máximo possível

import { useEffect, useState, lazy, Suspense } from "react";
import { projects } from "./projects.js";
import { demoConfig } from "./demos.js";
const Editor = lazy(() => import("./Editor.jsx"));
export function navigateProject(id) {
  history.replaceState(null, "", `#projeto/${id}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
export default function ProjectRoute({ route }) {
  const [project, setProject] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    (async () => {
      const [kind, value] = route.split("/");
      if (kind === "projeto") {
        const p = await projects.get(value);
        if (current) setProject(p);
      } else {
        const p =
          kind === "usar"
            ? await projects.create(
                demoConfig(value),
                "Demonstração · " + demoConfig(value).name,
              )
            : await projects.fromTemplate(value, kind === "novo");
        if (current) navigateProject(p.id);
      }
    })().catch((e) => {
      if (current) setError(e.message);
    });
    return () => {
      current = false;
    };
  }, [route]);
  if (error)
    return (
      <main id="main" tabIndex={-1} className="route-error">
        <h1>Vamos recuperar o caminho.</h1>
        <p role="alert">{error}</p>
        <a className="primary-button" href="#projetos">
          Meus projetos
        </a>{" "}
        <a className="secondary-button" href="#modelos">
          Ver modelos e demonstrações
        </a>
      </main>
    );
  if (project?.archived)
    return (
      <main id="main" tabIndex={-1} className="route-error">
        <h1>Este projeto está arquivado.</h1>
        <p>Restaure-o em Meus projetos para continuar editando.</p>
        <a className="primary-button" href="#projetos">
          Meus projetos
        </a>
      </main>
    );
  return project ? (
    <Suspense
      fallback={
        <main id="main" className="loading-editor">
          Preparando o editor...
        </main>
      }
    >
      <Editor key={project.id} project={project} />
    </Suspense>
  ) : (
    <main id="main" tabIndex={-1} className="loading-editor" role="status">
      Abrindo seu projeto...
    </main>
  );
}

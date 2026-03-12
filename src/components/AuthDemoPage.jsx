import { demoUsers } from "../demoUsers";

function AuthDemoPage({ t, language, onSelectUser }) {
  const isSpanish = language === "es";

  return (
    <main className="demoAuthPage">
      <section className="demoAuthCard">
        <p className="demoAuthEyebrow">{isSpanish ? "Acceso de demostracion" : "Demo access"}</p>
        <h1>{isSpanish ? "Selecciona un usuario experimental" : "Select an experimental user"}</h1>
        <p>
          {isSpanish
            ? "Usa uno de estos perfiles para probar el flujo con React Router y dashboards por rol."
            : "Use one of these profiles to test the React Router flow and role-based dashboards."}
        </p>

        <div className="demoAuthGrid">
          {demoUsers.map((user) => (
            <article key={user.id} className="demoAuthUserCard">
              <img src={user.avatar} alt={user.displayName} className="demoAuthAvatar" />
              <div>
                <h2>{user.displayName}</h2>
                <p>{user.role === "host" ? (isSpanish ? "Host" : "Host") : (isSpanish ? "Cliente" : "Client")}</p>
                <p>{user.email}</p>
                <p>{`${isSpanish ? "Clave" : "Password"}: ${user.password}`}</p>
              </div>
              <button type="button" onClick={() => onSelectUser?.(user.id)}>
                {isSpanish
                  ? user.role === "host" ? "Entrar como host" : "Entrar como cliente"
                  : user.role === "host" ? "Sign in as host" : "Sign in as client"}
              </button>
            </article>
          ))}
        </div>

        <p className="demoAuthHint">
          {isSpanish
            ? "Tip: desde el menu de usuario puedes cerrar sesion y volver a esta vista."
            : "Tip: from the user menu, you can sign out and return to this screen."}
        </p>

        <button type="button" className="demoAuthBackBtn" onClick={() => window.history.back()}>
          {isSpanish ? "Volver" : "Go back"}
        </button>
      </section>
    </main>
  );
}

export default AuthDemoPage;

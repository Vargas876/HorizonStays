import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";

function HostDashboardPage({
  t,
  language,
  onToggleLanguage,
  isUserMenuOpen,
  setIsUserMenuOpen,
  userMenuRef,
  logoImg,
  onUserMenuAction,
  listings = [],
  isAuthenticated,
  onAuthAction,
  currentUser
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSpanish = language === "es";
  const currentSection = searchParams.get("section") || "overview";

  const hostListings = useMemo(() => listings.slice(0, 4), [listings]);

  const dashboardStats = useMemo(() => {
    const totalListings = hostListings.length;
    const occupancy = "82%";
    const income = isSpanish ? "$14.8M COP" : "$14.8M COP";

    return [
      { key: "listings", label: isSpanish ? "Alojamientos activos" : "Active listings", value: String(totalListings) },
      { key: "occupancy", label: isSpanish ? "Ocupacion mensual" : "Monthly occupancy", value: occupancy },
      { key: "income", label: isSpanish ? "Ingresos estimados" : "Estimated revenue", value: income }
    ];
  }, [hostListings.length, isSpanish]);

  const reservations = useMemo(
    () => [
      {
        id: "res-1",
        guest: "Sofia Martinez",
        stay: isSpanish ? "Cabana Bosque Azul" : "Bosque Azul Cabin",
        date: isSpanish ? "20 - 23 marzo" : "Mar 20 - Mar 23",
        status: isSpanish ? "Confirmada" : "Confirmed"
      },
      {
        id: "res-2",
        guest: "Daniel Perez",
        stay: isSpanish ? "Loft Rio Claro" : "Rio Claro Loft",
        date: isSpanish ? "28 - 30 marzo" : "Mar 28 - Mar 30",
        status: isSpanish ? "Pendiente" : "Pending"
      }
    ],
    [isSpanish]
  );

  const setSection = (section) => {
    const params = new URLSearchParams(searchParams);
    params.set("section", section);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="profileDashPage hostDashPage">
      <Navbar
        t={t}
        language={language}
        onToggleLanguage={onToggleLanguage}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        userMenuRef={userMenuRef}
        logoImg={logoImg}
        onUserMenuAction={onUserMenuAction}
        isAuthenticated={isAuthenticated}
        onAuthAction={onAuthAction}
        currentUser={currentUser}
      />

      <main className="profileDashLayout">
        <aside className="profileDashSidebar">
          <div className="profileDashUserBlock">
            <img className="profileDashUserPhoto" src={currentUser?.avatar} alt={currentUser?.displayName || "Host"} loading="lazy" decoding="async" />
            <div>
              <h2>{currentUser?.displayName || (isSpanish ? "Host" : "Host")}</h2>
              <span>{isSpanish ? "Panel de anfitrion" : "Host dashboard"}</span>
            </div>
          </div>

          <ul className="profileDashMenu">
            {[
              { key: "overview", label: isSpanish ? "Resumen" : "Overview" },
              { key: "properties", label: isSpanish ? "Propiedades" : "Properties" },
              { key: "reservations", label: isSpanish ? "Reservas" : "Reservations" },
              { key: "earnings", label: isSpanish ? "Ingresos" : "Earnings" },
              { key: "settings", label: isSpanish ? "Configuracion" : "Settings" }
            ].map((item) => (
              <li key={item.key} className={currentSection === item.key ? "active" : ""}>
                <button type="button" className="profileDashMenuBtn" onClick={() => setSection(item.key)}>{item.label}</button>
              </li>
            ))}
          </ul>

          <button className="profileDashReserveBtn" type="button" onClick={() => navigate("/")}>
            {isSpanish ? "Ir al catalogo" : "Go to catalog"}
          </button>
        </aside>

        <section className="profileDashMain hostDashMain">
          <header className="profileDashHeading">
            <h1>{isSpanish ? "Dashboard del host" : "Host dashboard"}</h1>
            <p>{isSpanish ? "Gestiona alojamientos, reservas e ingresos desde un solo lugar." : "Manage listings, bookings and earnings from one place."}</p>
          </header>

          <section className="hostDashStatsGrid">
            {dashboardStats.map((item) => (
              <article key={item.key} className="hostDashStatCard">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </section>

          <section className="hostDashPanel">
            <h2>{isSpanish ? "Tus alojamientos" : "Your listings"}</h2>
            <div className="hostDashListingGrid">
              {hostListings.map((listing) => (
                <article key={listing.id} className="hostDashListingCard">
                  <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" />
                  <div>
                    <h3>{listing.title}</h3>
                    <p>{listing.location}</p>
                    <button type="button" className="profileDashPrimaryBtn" onClick={() => navigate(`/stay/${listing.id}`)}>
                      {isSpanish ? "Ver detalle" : "View detail"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="hostDashPanel">
            <h2>{isSpanish ? "Reservas recientes" : "Recent bookings"}</h2>
            <ul className="hostDashReservationList">
              {reservations.map((reservation) => (
                <li key={reservation.id}>
                  <div>
                    <strong>{reservation.guest}</strong>
                    <p>{`${reservation.stay} · ${reservation.date}`}</p>
                  </div>
                  <span>{reservation.status}</span>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>

      <footer className="profileDashFooter">
        <div className="profileDashFooterBrand">La Villa</div>
        <div className="profileDashFooterLinks">
          {t.profileDashboard.footer.links.map((link) => (
            <Link key={link.path} to={link.path}>{link.label}</Link>
          ))}
        </div>
        <p>{t.profileDashboard.footer.rights}</p>
      </footer>
    </div>
  );
}

export default HostDashboardPage;

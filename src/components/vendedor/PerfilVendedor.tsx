interface PerfilVendedorProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
}

export default function PerfilVendedor({ userName, userEmail, userAvatar }: PerfilVendedorProps) {
  return (
    <section className="seller-panel-view">
      <div>
        <p className="seller-eyebrow">Cuenta</p>
        <h2>Perfil del vendedor</h2>
      </div>
      <article className="seller-profile-card">
        <img src={userAvatar} alt={userName} />
        <div>
          <h3>{userName}</h3>
          <p>{userEmail}</p>
          <span>Rol vendedor activo</span>
        </div>
      </article>
    </section>
  );
}
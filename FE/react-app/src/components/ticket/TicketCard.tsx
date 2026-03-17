import '../../assets/css/ticket-card.css';
export default function TicketCard({ ve }: any) {
  return (
    <div className="card">
      <img src={ve.hinhAnh} />
      <h3>{ve.tenVe}</h3>
      <p>{ve.diemDen}</p>
      <h4>{ve.gia} VND</h4>
      <button>Đặt vé</button>
    </div>
  );
}
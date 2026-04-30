import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Result, Divider } from "antd";
import dayjs from "dayjs";
import "./SuccessPage.css";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lastBooking"));
    if (!stored) {
      navigate("/");
      return;
    }
    setBooking(stored);
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="success-page-wrapper">
      <Result
        status="success"
        title="Booking Confirmed!"
        subTitle="Your appointment has been successfully booked."
      />

      <Card className="success-card">
        <h3>Customer Details</h3>
        <p><b>Name:</b> {booking.name}</p>
        <p><b>Email:</b> {booking.email}</p>
        <p><b>Phone:</b> {booking.phone}</p>
        <p><b>Address:</b> {booking.address}</p>

        <Divider />

        <h3>Appointment Details</h3>
        <p>
          <b>Date:</b>{" "}
          {dayjs(booking.selectedDate).format("DD MMM YYYY")}
        </p>
        <p><b>Time Slot:</b> {booking.selectedTime}</p>
        <p><b>Payment Method:</b> {booking.paymentMethod.toUpperCase()}</p>

        <Divider />

        <h3>Services Booked</h3>
        {booking.items.map((item, idx) => (
          <div key={idx} className="success-item">
            <span>{item.name}</span>
            <span>x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <Divider />

        <h2 className="success-total">
          Total Paid: ₹{booking.totalAmount}
        </h2>
      </Card>

      <div className="success-actions">
        <Button type="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
        <Button onClick={() => navigate("/booking-history")}>
          View My Bookings
        </Button>
      </div>
    </div>
  );
}

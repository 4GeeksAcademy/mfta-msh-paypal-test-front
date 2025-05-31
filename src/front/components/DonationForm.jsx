import { useState, useRef, useEffect } from "react";

const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const DonationForm = () => {
  const [amount, setAmount] = useState("");
  const [showButton, setShowButton] = useState(false);
  const paypalRef = useRef();

  const handleDonate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 1 || num > 500) {
      alert("Por favor, ingrese un monto entre 1 y 500 USD.");
      return;
    }
    setShowButton(true);
  };

  useEffect(() => {
    if (!showButton) return;

    if (!window.paypal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&currency=USD`;
      script.onload = () => renderButton();
      document.body.appendChild(script);
    } else {
      renderButton();
    }

    function renderButton() {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: parseFloat(amount).toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          alert(`¡Gracias por tu donación, ${details.payer.name.given_name}!`);
          setShowButton(false);
          setAmount("");
        },
        onError: (err) => {
          console.error("Error en el pago:", err);
          alert("Ocurrió un error con el pago.");
        },
      }).render(paypalRef.current);
    }
  }, [showButton]);

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <h2 className="mb-3">Realizar una donación</h2>
      <div className="mb-3" style={{ width: "200px" }}>
        <input
            className="form-control"
            type="number"
            placeholder="Monto en USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="5"
            max="500"
            step="1"
        />
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleDonate}>Donar</button>
      </div>

      {
        showButton && 
            <div className="container d-flex justify-content-center">
                <div ref={paypalRef} style={{ marginTop: "20px" }}></div>
            </div>
    }
    </div>
  );
};

export default DonationForm;

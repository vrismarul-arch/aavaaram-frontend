// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Process Razorpay payment
export const processRazorpayPayment = async (amount, orderData, onSuccess, onError) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    
    // Step 1: Create order on backend
    const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount }),
    });

    const orderResult = await orderResponse.json();

    if (!orderResult.success) {
      throw new Error(orderResult.message || "Failed to create order");
    }

    // Step 2: Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Step 3: Configure Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderResult.order.amount,
      currency: orderResult.order.currency,
      name: "Your Store Name",
      description: "Order Payment",
      order_id: orderResult.order.id,
      handler: async (response) => {
        // Step 4: Verify payment on backend
        const verifyResponse = await fetch(`${API_URL}/payment/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: orderData,
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (verifyResult.success) {
          onSuccess(verifyResult.order);
        } else {
          onError(verifyResult.message || "Payment verification failed");
        }
      },
      prefill: {
        name: orderData.customer?.name || "",
        email: orderData.customer?.email || "",
        contact: orderData.customer?.phone || "",
      },
      notes: {
        address: orderData.customer?.address || "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {
          onError("Payment cancelled by user");
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error("Payment Error:", error);
    onError(error.message);
  }
};

// Process COD order
export const processCODOrder = async (orderData, onSuccess, onError) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL;
    
    const response = await fetch(`${API_URL}/payment/cod-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.success) {
      onSuccess(result.order);
    } else {
      onError(result.message || "COD order failed");
    }
  } catch (error) {
    console.error("COD Error:", error);
    onError(error.message);
  }
};
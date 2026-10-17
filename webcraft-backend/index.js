const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Razorpay Setup (Keys Render ke Environment Variables se aayengi)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 2. Firebase Admin Setup (Database mein credits add karne ke liye)
// Aapko Firebase Console -> Project Settings -> Service Accounts se ek JSON file milegi.
// Us JSON ko Render ke ENV variable (FIREBASE_SERVICE_ACCOUNT) mein daalna hoga.
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.log("Warning: Firebase Service Account not found. Database updates will fail.");
}

// 3. API Endpoint: Create Order (Frontend isko call karega)
app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR (e.g., 50)
    
    const options = {
      amount: amount * 100, // Razorpay amount in paise (50 INR = 5000 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. API Endpoint: Verify Payment (Payment ke baad Frontend call karega)
app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, creditsToAdd } = req.body;

    // Signature Verify Karna (Security ke liye)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment Real Hai! Ab Database mein Credits badhao.
      const db = admin.firestore();
      const userRef = db.collection('users').doc(userId);
      
      await userRef.set({
        credits: admin.firestore.FieldValue.increment(Number(creditsToAdd))
      }, { merge: true });

      res.json({ success: true, message: "Payment Verified & Credits Added" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/', (req, res) => res.send('Backend is running perfectly!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

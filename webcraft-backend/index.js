const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const admin = require('firebase-admin');
const crypto = require('crypto'); // Signature verify karne ke liye zaroori hai

const app = express();

// CORS setup (Taaki aapki Vercel website backend se baat kar sake)
app.use(cors()); 
app.use(express.json());

// 1. Razorpay Setup (Keys Render ke Environment Variables se aayengi)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 2. Firebase Admin Setup (Database mein credits add karne ke liye)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Firebase Admin Init Error: Check your JSON format", error);
  }
} else {
  console.log("Warning: FIREBASE_SERVICE_ACCOUNT ENV missing.");
}

// 3. API: Create Order (Jab user Top-up dabayega)
app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR (e.g., 50)
    
    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Razorpay amount in paise (₹50 = 5000 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order: order });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. API: Verify Payment (Jab payment successful ho jaye)
app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, creditsToAdd } = req.body;

    // Security Check: Signature verify karna (Taaki koi fake payment na kar sake)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Agar signature match ho gaya (Payment 100% Real hai)
    if (expectedSignature === razorpay_signature) {
      
      // Firebase Database mein Credits Add karo
      const db = admin.firestore();
      const userRef = db.collection('users').doc(userId);
      
      await userRef.set({
        credits: admin.firestore.FieldValue.increment(Number(creditsToAdd))
      }, { merge: true }); // Merge true taaki purana data delete na ho

      res.json({ success: true, message: "Payment Verified & Credits Added" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature (Fake Payment)" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test Route (Render par check karne ke liye)
app.get('/', (req, res) => res.send('WebCraft Backend is running perfectly!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

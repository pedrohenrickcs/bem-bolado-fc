
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfMkhjncYeA5zIoWDSzdGStTxelnjAvgw",
  authDomain: "bem-bolado-fc-66834.firebaseapp.com",
  projectId: "bem-bolado-fc-66834",
  storageBucket: "bem-bolado-fc-66834.firebasestorage.app",
  messagingSenderId: "722681365581",
  appId: "1:722681365581:web:5e443b88409332e4198804"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)

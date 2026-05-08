// Re-export everything from the canonical firebase.ts
// This ensures AuthContext and App.tsx use the SAME Firebase instance
import { auth, db, storage } from '../firebase';
export { auth, db, storage };

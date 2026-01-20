import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // Assuming you have a db object exported from your Firebase config

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false });
        try {
            const docRef = doc(db, "users", uid); // Adjust collection and document names as needed
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false });
            } else {
                set({ currentUser: null, isLoading: false });

            }
        } catch (err) {
            console.log(err);

            set({ currentUser: null, isLoading: false });
        }
    },
}));

export default useUserStore;

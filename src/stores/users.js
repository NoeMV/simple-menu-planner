import { doc, setDoc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@firebase/auth';
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore('users', () => {

    const db = getFirestore();
    const router = useRouter();

    const user = ref({});
    const errorMessage = ref("");
    const isLoggedIn = ref (false);

    onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
            isLoggedIn.value = true;
            await getUser(user.uid);
        } else {
            isLoggedIn.value = false;
        }
    });

    const register = async (name, email, password) => {
        try {
            const res = await createUserWithEmailAndPassword(getAuth(), email, password);
            await addUser(res.user.uid, {name: name, email: res.user.email, menus: []});
            router.push('/dashboard');
        } catch (error) {
            switch(error.code){
                case "auth/invalid-email":
                    errorMessage.value = "Email inválido";
                break;

                case "auth/user-not-found":
                    errorMessage.value = "No se encontró una cuenta asociado a este email";
                break;

                case "auth/wrong-password":
                    errorMessage.value = "Contraseña inválida";
                break;

                default:
                    errorMessage.value = "Email o contraseña inválidos";
                break;
            }
        }
    }

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            router.push('/dashboard');
        } catch (error) {
            switch(error.code){
                case "auth/invalid-email":
                    errorMessage.value = "Email inválido";
                break;

                case "auth/user-not-found":
                    errorMessage.value = "No se encontró una cuenta asociado a este email";
                break;

                case "auth/wrong-password":
                    errorMessage.value = "Contraseña incorrecta";
                break;

                default:
                    errorMessage.value = "Email o contraseña incorrectos";
                break;
            }
        }
    }

    const authWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(getAuth(), provider);
            if(res._tokenResponse.hasOwnProperty('isNewUser')){
                await addUser(res.user.uid, {name: res.user.displayName, email: res.user.email, menus: []});
            }
            router.push('/dashboard');
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        try {
            await signOut(getAuth());
            user.value = null;
            router.push('/login');
        } catch (error) {
            console.log(error);
        }
    }

    const addUser = async (id, data) => {
        try {
            await setDoc(doc(db, "users", id), data);
        } catch (error) {
            console.log(error);
        }
    }

    const getUser = async (id) => {
        try {
            const response = await getDoc(doc(db, "users", id));
            let obj = response.data();
            obj.id = response.id;
            user.value = obj;
        } catch (error) {
            console.log(error);
        }
    }

    const updateUser = async (id, data) => {
        try {
            await updateDoc(doc(db, "users", id), data);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        user,
        errorMessage,
        isLoggedIn,
        register,
        login,
        authWithGoogle,
        logout,
        addUser,
        getUser,
        updateUser
    };
});
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, getFirestore, documentId, updateDoc, deleteDoc  } from "firebase/firestore";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenusStore = defineStore('menus', () => {

    const db = getFirestore();
    const router = useRouter();

    const menu = ref({});
    const menus = ref([]);

    const meal = ref({});
    const meals = ref([]);

    const ingredient = ref({});
    const ingredients = ref([]);

    const requests = ref([]);
    const blocked = ref([]);
    const participants = ref([]);

    const errorMessage = ref("");

    const createMenu = async (data) => {
        try {
            const response = await addDoc(collection(db, "menus"), data);
            await getMenu(response.id);
        } catch (error) {
            console.log(error);
        }
    }

    const getMenu = async (id) => {
        try {
            errorMessage.value = "";
            const response = await getDoc(doc(db, "menus", id));
            if (response.exists()) {
                let obj = response.data();
                obj.id = response.id;
                menu.value = obj;
            } else {
                errorMessage.value = "No se ha encontrado el menu"
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getMenusUser = async (identifiers) => {
        if(identifiers.length == 0){
            menus.value = [];
            return;
        }

        try {
            const q = query(collection(db, "menus"), where(documentId(), 'in', identifiers));

            const response = await getDocs(q);

            const aux = [];
            let obj;
            response.forEach((doc) => {
                obj = doc.data();
                obj.id = doc.id;
                aux.push(obj);
            });
            menus.value = [...aux];
        } catch (error) {
            console.log(error);
        }
    }

    const getMeal = async (id) => {
        try {
            const response = await getDoc(doc(db, "meals", id))
            let obj = response.data();
            obj.id = response.id;
            meal.value = obj;
        } catch (error) {
            console.log(error);
        }
    }

    const getMeals = async (identifiers) => {
        if(identifiers.length == 0){
            meals.value = [];
            return;
        }

        try {
            const q = query(collection(db, "meals"), where(documentId(), 'in', identifiers));

            const response = await getDocs(q);

            const aux = [];
            let obj;
            response.forEach((doc) => {
                obj = doc.data();
                obj.id = doc.id;
                aux.push(obj);
            });
            meals.value = [...aux];
        } catch (error) {
            console.log(error);
        }
    }

    const getIngredient = async (id) => {
        try {
            const response = await getDoc(doc(db, "ingredients", id))
            let obj = response.data();
            obj.id = response.id;
            ingredient.value = obj;
        } catch (error) {
            console.log(error);
        }
    }

    const getIngredients = async (identifiers) => {
        if(identifiers.length == 0){
            ingredients.value = [];
            return;
        }

        try {
            const q = query(collection(db, "ingredients"), where(documentId(), 'in', identifiers));

            const response = await getDocs(q);

            const aux = [];
            let obj;
            response.forEach((doc) => {
                obj = doc.data();
                obj.id = doc.id;
                aux.push(obj);
            });
            ingredients.value = [...aux];
        } catch (error) {
            console.log(error);
        }
    }

    const getRequests = async (identifiers) => {
        if(identifiers.length == 0){
            requests.value = [];
            return;
        }

        try {
            const q = query(collection(db, "users"), where(documentId(), 'in', identifiers));

            const response = await getDocs(q);

            const aux = [];
            let obj;
            response.forEach((doc) => {
                obj = doc.data();
                obj.id = doc.id;
                aux.push(obj);
            });
            requests.value = [...aux];
        } catch (error) {
            console.log(error);
        }
    }

    const getParticipants = async (identifiers) => {
        if(identifiers.length == 0){
            participants.value = [];
            return;
        }

        try {
            const q = query(collection(db, "users"), where(documentId(), 'in', identifiers));

            const response = await getDocs(q);

            const aux = [];
            let obj;
            response.forEach((doc) => {
                obj = doc.data();
                obj.id = doc.id;
                aux.push(obj);
            });
            participants.value = [...aux];
        } catch (error) {
            console.log(error);
        }
    }

    const getBlocked = async (identifiers) => {
        if(identifiers.length == 0){
            blocked.value = [];
            return;
        }

        try {
            const q = query(collection(db, "users"), where(documentId(), 'in', identifiers));

            const response = await getDocs(q);

            const aux = [];
            let obj;
            response.forEach((doc) => {
                obj = doc.data();
                obj.id = doc.id;
                aux.push(obj);
            });
            blocked.value = [...aux];
        } catch (error) {
            console.log(error);
        }
    }

    const updateMenu = async (id, data) => {
        try {
            await updateDoc(doc(db, "menus", id), data);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        menu, 
        menus,
        meal,
        meals,
        ingredient,
        ingredients,
        requests,
        participants,
        blocked,
        errorMessage,
        createMenu,
        getMenu,
        getMenusUser,
        getMeal,
        getMeals,
        getIngredient,
        getIngredients,
        getRequests,
        getParticipants,
        getBlocked,
        updateMenu
    };
});
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, getFirestore, documentId, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useUsersStore } from './users';

export const useMenusStore = defineStore('menus', () => {

    const db = getFirestore();
    const router = useRouter();

    const userStore = useUsersStore();

    const createMenu = async (data) => {
        const menuCreated = ref({});

        try {
            const response = await addDoc(collection(db, "menus"), data);
            menuCreated.value = {id: response.id, ...response.data()};
        } catch (error) {
            console.log(error);
        }

        return { menuCreated };
    }

    const getMenu = async (id) => {
        const menu = ref({});
        const errorMenu = ref('');

        try {
            const response = await getDoc(doc(db, "menus", id))
            if(response.exists()){
                menu.value = {id: response.id, ...response.data()};
                errorMenu.value = "";
            } else {
                errorMenu.value = "No se ha encontrado el menu";
            }
        } catch (error) {
            console.log(error);
        }

        return { menu, errorMenu };
    }

    const getMeal = async (id) => {
        const meal = ref({});
        const errorMeal = ref('');

        try {
            const response = await getDoc(doc(db, "meals", id))
            if(response.exists()){
                meal.value = {id: response.id, ...response.data()};
                errorMeal.value = "";
            } else {
                errorMeal.value = "No se ha encontrado la comida";
            }
        } catch (error) {
            console.log(error);
        }

        return { meal, errorMeal };
    }

    const getMeals = async (identifiers) => {
        const meals = ref([]);
        const errorMeals = ref('');

        if(identifiers.length == 0){
            errorMeals.value = "No hay comidas en el menu";
        } else {
            try {
                const q = query(collection(db, "meals"), where(documentId(), 'in', identifiers));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    errorMeals.value = "";
                    meals.value.push({id: doc.id, ...doc.data()});
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        return { meals, errorMeals };
    }

    
    const getIngredient = async (id) => {
        const ingredient = ref({});
        const errorIngredient = ref('');

        try {
            const response = await getDoc(doc(db, "ingredients", id))
            if(response.exists()){
                ingredient.value = {id: response.id, ...response.data()};
                errorIngredient.value = "";
            } else {
                errorIngredient.value = "No se ha encontrado el ingrediente";
            }
        } catch (error) {
            console.log(error);
        }

        return { ingredient, errorIngredient };
    }

    const getIngredients = async (identifiers) => {
        const ingredients = ref([]);
        const errorIngredients = ref('');

        if(identifiers.length == 0){
            errorIngredients.value = "No hay ingredientes";
        } else {
            try {
                const q = query(collection(db, "ingredients"), where(documentId(), 'in', identifiers));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    errorIngredients.value = "";
                    ingredients.value.push({id: doc.id, ...doc.data()});
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        return { ingredients, errorIngredients };
    }

    const getRequests = async (identifiers) => {
        const requests = ref([]);
        const errorRequests = ref('');

        if(identifiers.length == 0){
            errorRequests.value = "No hay solicitudes para unirse al menu";
        } else {
            try {
                const q = query(collection(db, "users"), where(documentId(), 'in', identifiers));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    errorRequests.value = "";
                    requests.value.push({id: doc.id, ...doc.data()});
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        return { requests, errorRequests };
    }

    const getParticipants = async (identifiers) => {
        const participants = ref([]);
        const errorParticipants = ref('');

        if(identifiers.length == 0){
            errorParticipants.value = "No hay comidas en el menu";
        } else {
            try {
                const q = query(collection(db, "users"), where(documentId(), 'in', identifiers));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    errorParticipants.value = "";
                    participants.value.push({id: doc.id, ...doc.data()});
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        return { participants, errorParticipants };
    }

    const getBlocked = async (identifiers) => {
        const blocked = ref([]);
        const errorBlocked = ref('');

        if(identifiers.length == 0){
            errorBlocked.value = "No hay comidas en el menu";
        } else {
            try {
                const q = query(collection(db, "users"), where(documentId(), 'in', identifiers));
                const response = await getDocs(q);
                response.forEach((doc) => {
                    errorBlocked.value = "";
                    blocked.value.push({id: doc.id, ...doc.data()});
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        return { blocked, errorBlocked };
    }

    const updateMenu = async (id, data) => {
        try {
            await updateDoc(doc(db, "menus", id), data);
        } catch (error) {
            console.log(error);
        }
    }

    const acceptRequest = async (menuId, targetId, currentUserId, requestsData, participantsData) => {
        const requestList = requestsData.value.map(e => e.id);
        const index = requestList.indexOf(targetId);
        requestList.splice(index, 1);

        const participantList = participantsData.value.map(e => e.id);
        participantList.push(targetId);

        await updateMenu(menuId, {requests: requestList, participants: participantList});

        await userStore.getUser(targetId);
        const menuList = userStore.user.menus;
        const indexMenu = menuList.map(e => e.code).indexOf(menuId);
        menuList[indexMenu].status = 'participant';
        
        await userStore.updateUser(targetId, {menus: menuList});

        await userStore.getUser(currentUserId);
    }

    const cancelRequest = async (menuId, targetId, currentUserId, requestsData) => {
        const requestList = requestsData.value.map(e => e.id);
        const index = requestList.indexOf(targetId);
        requestList.splice(index, 1);

        await updateMenu(menuId, {requests: requestList});

        await userStore.getUser(targetId);
        const menuList = userStore.user.menus;
        const indexMenu = menuList.map(e => e.code).indexOf(menuId);
        menuList.splice(indexMenu, 1);
        
        await userStore.updateUser(targetId, {menus: menuList});

        await userStore.getUser(currentUserId);
    }

    const blockRequest = async (menuId, targetId, currentUserId, requestsData, blockedData) => {
        const requestList = requestsData.value.map(e => e.id);
        const index = requestList.indexOf(targetId);
        requestList.splice(index, 1);

        const blockedList = blockedData.value.map(e => e.id);
        blockedList.push(targetId);

        await updateMenu(menuId, {requests: requestList, blocked: blockedList});

        await userStore.getUser(targetId);
        const menuList = userStore.user.menus;
        const indexMenu = menuList.map(e => e.code).indexOf(menuId);
        menuList[indexMenu].status = 'blocked';
        
        await userStore.updateUser(targetId, {menus: menuList});

        await userStore.getUser(currentUserId);
    }

    const unblockUser = async (menuId, targetId, currentUserId, blockedData) => {
        const blockedList = blockedData.value.map(e => e.id);
        const index = blockedList.indexOf(targetId);
        blockedList.splice(index, 1);

        await updateMenu(menuId, {blocked: blockedList});

        await userStore.getUser(targetId);
        const menuList = userStore.user.menus;
        const indexMenu = menuList.map(e => e.code).indexOf(menuId);
        menuList.splice(indexMenu, 1);
        
        await userStore.updateUser(targetId, {menus: menuList});

        await userStore.getUser(currentUserId);
    }

    const removeParticipant = async (menuId, targetId, currentUserId, participantsData) => {
        const participantList = participantsData.value.map(e => e.id);
        const index = participantList.indexOf(targetId);
        participantList.splice(index, 1);

        await updateMenu(menuId, {participants: participantList});

        await userStore.getUser(targetId);
        const menuList = userStore.user.menus;
        const indexMenu = menuList.map(e => e.code).indexOf(menuId);
        menuList.splice(indexMenu, 1);
        
        await userStore.updateUser(targetId, {menus: menuList});

        await userStore.getUser(currentUserId);
    }

    return {
        createMenu,
        getMenu,
        getMeal,
        getMeals,
        getIngredient,
        getIngredients,
        getRequests,
        getParticipants,
        getBlocked,
        updateMenu,
        acceptRequest,
        cancelRequest,
        blockRequest,
        unblockUser,
        removeParticipant
    };
});
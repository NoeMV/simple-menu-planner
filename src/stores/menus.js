import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, getFirestore, documentId, updateDoc, deleteDoc, runTransaction } from "firebase/firestore";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUsersStore } from './users';

export const useMenusStore = defineStore('menus', () => {

    const db = getFirestore();

    const userStore = useUsersStore();

    const currentMenuId = ref("");

    const createMenu = async (data) => {
        const menuCreated = ref({});
        try {
            await runTransaction(db, async (transaction) => {
                const menuRef = doc(collection(db, "menus"));
                transaction.set(menuRef, data);
                menuCreated.value = {id: menuRef.id};

                const aux = userStore.user.menus;
                aux.push({
                    code: menuCreated.value.id,
                    name: data.name,
                    status: 'participant',
                    creator: true
                });

                transaction.update(doc(db, "users", userStore.user.id), {menus: aux});
            });
        } catch (error) {
            console.log(error);
        }

        return { menuCreated };
    }

    const joinMenu = async (id) => {
        const error = ref('');

        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", id));

                if(!response.exists()){
                    error.value = "El menu no existe";
                    return { error };
                } 

                let index = userStore.user.menus.map(e => e.code).indexOf(id);
                if (index != -1) {
                    switch (userStore.user.menus[index].status){
                        case "participant":
                            error.value = "Ya estás participando en este menu";
                        break;
                        case "pending":
                            error.value = "Tu solicitud para unirte al menu sigue en espera";
                        break;
                        case "blocked":
                            error.value = "Has sido bloqueado de este menu";
                        break;
                        default:
                            error.value = "Ha ocurrido un error";
                        break;
                    }
                    return { error };
                }

                const menu = {id: response.id, ...response.data()};

                // get menu requests array and add user id
                const menuRequests = menu.requests;
                menuRequests.push(userStore.user.id);
                transaction.update(doc(db, "menus", id), {requests: menuRequests});

                // get user menus and add new menu info (pending which means waiting for approval)
                const userMenus = userStore.user.menus;
                userMenus.push({
                    code: menu.id,
                    name: menu.name,
                    status: 'pending',
                    creator: false
                });
                transaction.update(doc(db, "users", userStore.user.id), {menus: userMenus});
            });
        } catch (error) {
            console.log(error);
        }

        return { error };
    }

    const getMenu = async (id) => {
        const menu = ref({});
        const errorMenu = ref('');

        try {
            const response = await getDoc(doc(db, "menus", id))
            if(response.exists()){
                menu.value = {id: response.id, ...response.data()};
                errorMenu.value = "";
                currentMenuId.value = response.id;
            } else {
                errorMenu.value = "No se ha encontrado el menu";
            }
        } catch (error) {
            console.log(error);
        }

        return { menu, errorMenu };
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

    const deleteMenu = async (menuId, mealsIds, ingredientsIds, participantsIds, blockedIds, requestsIds) => {
        try {
            const usersMenu = [...participantsIds, ...blockedIds, ...requestsIds];

            const {users, errorUsers} = await userStore.getUsers(usersMenu);

            await runTransaction(db, async(transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));
                const menu = {id: response.id, ...response.data()};

                if(ingredientsIds.length != 0){
                    ingredientsIds.forEach(ingredientId => {
                        transaction.delete(doc(db, "ingredients", ingredientId)); 
                    });
                }
                
                if(mealsIds.length != 0){
                    mealsIds.forEach(mealId => {
                        transaction.delete(doc(db, "meals", mealId));
                    });
                }

                users.value.forEach(user => {
                    const menuList = user.menus;
                    const indexMenu = menuList.map(e => e.code).indexOf(menuId);
                    menuList.splice(indexMenu, 1);

                    transaction.update(doc(db, "users", user.id), {menus: menuList});
                });

                transaction.delete(doc(db, "menus", menuId));
            });
        } catch (error) {
            console.log(error);
        }
    }

    const acceptRequest = async (menuId, targetId) => {
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));

                if(!response.exists()){
                    return;
                } 

                const menu = {id: response.id, ...response.data()};

                const userResponse = await transaction.get(doc(db, "users", targetId));

                if(!userResponse.exists()){
                    return;
                } 

                const user = {id: userResponse.id, ...userResponse.data()};

                const requestList = menu.requests;
                const index = requestList.indexOf(targetId);
                requestList.splice(index, 1);

                const participantList = menu.participants;
                participantList.push(targetId);

                transaction.update(doc(db, "menus", menuId), {requests: requestList, participants: participantList});

                const menuList = user.menus;
                const indexMenu = menuList.map(e => e.code).indexOf(menuId);
                menuList[indexMenu].status = 'participant';
                
                transaction.update(doc(db, "users", targetId), {menus: menuList});
            });
        } catch (error) {
            console.log(error);
        }
    }

    const cancelRequest = async (menuId, targetId) => {
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));

                if(!response.exists()){
                    return;
                } 

                const menu = {id: response.id, ...response.data()};

                const userResponse = await transaction.get(doc(db, "users", targetId));

                if(!userResponse.exists()){
                    return;
                } 

                const user = {id: userResponse.id, ...userResponse.data()};

                const requestList = menu.requests;
                const index = requestList.indexOf(targetId);
                requestList.splice(index, 1);

                transaction.update(doc(db, "menus", menuId), {requests: requestList});

                const menuList = user.menus;
                const indexMenu = menuList.map(e => e.code).indexOf(menuId);
                menuList.splice(indexMenu, 1);
                
                transaction.update(doc(db, "users", targetId), {menus: menuList});
            });
        } catch (error) {
            console.log(error);
        }
    }

    const blockRequest = async (menuId, targetId) => {
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));

                if(!response.exists()){
                    return;
                } 

                const menu = {id: response.id, ...response.data()};

                const userResponse = await transaction.get(doc(db, "users", targetId));

                if(!userResponse.exists()){
                    return;
                } 

                const user = {id: userResponse.id, ...userResponse.data()};

                const requestList = menu.requests;
                const index = requestList.indexOf(targetId);
                requestList.splice(index, 1);

                const blockedList = menu.blocked;
                blockedList.push(targetId);

                transaction.update(doc(db, "menus", menuId), {requests: requestList, blocked: blockedList});

                const menuList = user.menus;
                const indexMenu = menuList.map(e => e.code).indexOf(menuId);
                menuList[indexMenu].status = 'blocked';
                
                transaction.update(doc(db, "users", targetId), {menus: menuList});
            });
        } catch (error) {
            console.log(error);
        }
    }

    const unblockUser = async (menuId, targetId) => {
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));

                if(!response.exists()){
                    return;
                } 

                const menu = {id: response.id, ...response.data()};

                const userResponse = await transaction.get(doc(db, "users", targetId));

                if(!userResponse.exists()){
                    return;
                } 

                const user = {id: userResponse.id, ...userResponse.data()};

                const blockedList = menu.blocked;
                const index = blockedList.indexOf(targetId);
                blockedList.splice(index, 1);

                transaction.update(doc(db, "menus", menuId), {blocked: blockedList});

                const menuList = user.menus;
                const indexMenu = menuList.map(e => e.code).indexOf(menuId);
                menuList.splice(indexMenu, 1);
                
                transaction.update(doc(db, "users", targetId), {menus: menuList});
            });
        } catch (error) {
            console.log(error);
        }
    }

    const removeParticipant = async (menuId, targetId) => {
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));

                if(!response.exists()){
                    return;
                } 

                const menu = {id: response.id, ...response.data()};

                const userResponse = await transaction.get(doc(db, "users", targetId));

                if(!userResponse.exists()){
                    return;
                } 

                const user = {id: userResponse.id, ...userResponse.data()};

                const participantList = menu.participants;
                const index = participantList.indexOf(targetId);
                participantList.splice(index, 1);

                transaction.update(doc(db, "menus", menuId), {participants: participantList});

                const menuList = user.menus;
                const indexMenu = menuList.map(e => e.code).indexOf(menuId);
                menuList.splice(indexMenu, 1);
                
                transaction.update(doc(db, "users", targetId), {menus: menuList});
            });
        } catch (error) {
            console.log(error);
        }
    }

    const createMeal = async (menuId, data) => {
        const mealCreated = ref({});
        const error = ref('');
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));
                const menu = {id: response.id, ...response.data()};

                const mealRef = doc(collection(db, "meals"));
                transaction.set(mealRef, data);
                mealCreated.value = {id: mealRef.id};

                const mealsList = menu.meals;
                mealsList.push(mealCreated.value.id);

                transaction.update(doc(db, "menus", menuId), {meals: mealsList});
            });
        } catch (error) {
            console.log(error);
            error.value = "Ha ocurrido un error, intenta más tarde";
        }

        return { error };
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

    const updateMeal = async (id, data) => {
        const error = ref('');
        try {
            await updateDoc(doc(db, "meals", id), data);
        } catch (error) {
            console.log(error);
            error.value = "Ha ocurrido un error, intenta más tarde";
        }

        return { error };
    }

    const deleteMeal = async (menuId, mealId) => {
        const error = ref('');
        try {
            await runTransaction(db, async (transaction) => {
                const menuResponse = await transaction.get(doc(db, "menus", menuId));
                const menu = {id: menuResponse.id, ...menuResponse.data()};

                const mealResponse = await transaction.get(doc(db, "meals", mealId));
                const meal = {id: mealResponse.id, ...mealResponse.data()};

                const mealsList = menu.meals;
                const index = mealsList.indexOf(mealId);
                mealsList.splice(index, 1);

                transaction.update(doc(db, "menus", menuId), {meals: mealsList});

                transaction.delete(doc(db, "meals", mealId));
            });
        } catch (error) {
            console.log(error);
            error.value = "Ha ocurrido un error, intenta más tarde"
        }

        return { error };
    }

    const createIngredient = async (menuId, data) => {
        const ingredientCreated = ref({});
        const error = ref('');
        try {
            await runTransaction(db, async (transaction) => {
                const response = await transaction.get(doc(db, "menus", menuId));
                const menu = {id: response.id, ...response.data()};

                const ingredientRef = doc(collection(db, "ingredients"));
                transaction.set(ingredientRef, data);
                ingredientCreated.value = {id: ingredientRef.id};

                const ingredientsList = menu.ingredients;
                ingredientsList.push(ingredientCreated.value.id);

                transaction.update(doc(db, "menus", menuId), {ingredients: ingredientsList});
            });
        } catch (error) {
            console.log(error);
            error.value = "Ha ocurrido un error, intenta más tarde"
        }

        return { error };
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

    const updateIngredient = async (id, data) => {
        try {
            await updateDoc(doc(db, "ingredients", id), data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteIngredient = async (menuId, ingredientId, mealsIdentifiers) => {
        const error = ref('');
        try {

            const {meals, errorMeals} = await getMeals(mealsIdentifiers);

            if(meals.value.some(meal => meal.ingredients.includes(ingredientId))){
                error.value = "No se puede eliminar el ingrediente porque está registrado en una comida";
                return { error };
            }

            await runTransaction(db, async (transaction) => {
                const menuResponse = await transaction.get(doc(db, "menus", menuId));
                const menu = {id: menuResponse.id, ...menuResponse.data()};

                const ingredientResponse = await transaction.get(doc(db, "ingredients", ingredientId));
                const ingredient = {id: ingredientResponse.id, ...ingredientResponse.data()};

                const ingredientsList = menu.ingredients;
                const index = ingredientsList.indexOf(ingredientId);
                ingredientsList.splice(index, 1);

                transaction.update(doc(db, "menus", menuId), {ingredients: ingredientsList});

                transaction.delete(doc(db, "ingredients", ingredientId));
            });
        } catch (error) {
            console.log(error);
            error.value = "Ha ocurrido un error, intenta más tarde";
        }

        return { error };
    }

    const calculateWeekDates = (week) => {
        const arrDates = [];

        let dateInput = new Date().toISOString().slice(0, 10);
        let copyDate = dateInput.slice().split('-');
        let date = new Date(copyDate[0], (copyDate[1] - 1), copyDate[2]);

        let dateWeekDay = date.getDay();
        let diff = date.getDate() - dateWeekDay + (dateWeekDay === 0 ? -6 : 1);

        let firstWeekDate = new Date(date.setDate(diff));

        let pivotDate;

        if (week == 'current') {
            pivotDate = firstWeekDate;
        }

        if (week == 'next') {
            let firstNextDate = new Date(firstWeekDate);
            firstNextDate.setDate(firstNextDate.getDate() + 7);
            pivotDate = firstNextDate;
        }

        if (week == 'two') {
            let firstNextTwoDate = new Date(firstWeekDate);
            firstNextTwoDate.setDate(firstNextTwoDate.getDate() + 14);
            pivotDate = firstNextTwoDate;
        }

        for(let i = 0 ; i < 7 ; i++){
            let tempDate = new Date(new Date(new Date(pivotDate)).setDate(pivotDate.getDate() + i));
            let tempDay = new Intl.DateTimeFormat("es-ES", {weekday: 'long'}).format(tempDate);

            arrDates.push({fullDate: tempDate.toISOString().slice(0, 10), weekday: tempDay.charAt(0).toUpperCase() + tempDay.slice(1), day: tempDate.getDate(), month: tempDate.getMonth() + 1, year: tempDate.getFullYear()});
        }

        return arrDates;
    }

    return {
        currentMenuId,
        createMenu,
        joinMenu,
        getMenu,
        getRequests,
        getParticipants,
        getBlocked,
        updateMenu,
        deleteMenu,
        acceptRequest,
        cancelRequest,
        blockRequest,
        unblockUser,
        createMeal,
        getMeal,
        getMeals,
        updateMeal,
        deleteMeal,
        createIngredient,
        getIngredient,
        getIngredients,
        updateIngredient,
        deleteIngredient,
        removeParticipant,
        calculateWeekDates
    };
});
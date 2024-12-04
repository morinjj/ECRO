// backend/firebase.jsw
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB6GQNrbnJtCVlews_IQhuKsWknxmX11n4",
    authDomain: "uecro-wyyugl.firebaseapp.com",
    projectId: "uecro-wyyugl",
    storageBucket: "uecro-wyyugl.firebasestorage.app",
    messagingSenderId: "763018091638",
    appId: "1:763018091638:web:e53dbe2aa8645ed0035357"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Get Firestore instance
const firestore = getFirestore();

// Function to get documents from a collection
export async function firestoreGetDocuments(collectionName, filter) {
    try {
        let q;
        if (filter) {
            q = query(collection(firestore, collectionName), where(filter.field, filter.operator, filter.value));
        } else {
            q = collection(firestore, collectionName);
        }
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ _id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

// Function to get a single document
export async function firestoreGetDocument(collectionName, docId) {
    try {
        const docRef = doc(firestore, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw error;
    }
}

// Function to create a new document
export async function firestoreCreateDocument(collectionName, data, docId = null) {
    try {
        let docRef;
        if (docId) {
            docRef = doc(firestore, collectionName, docId);
            await setDoc(docRef, data);
        } else {
            docRef = await addDoc(collection(firestore, collectionName), data);
        }
        console.log("Document written with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
}

// Function to update an existing document
export async function firestoreUpdateDocument(collectionName, docId, data) {
    try {
        const docRef = doc(firestore, collectionName, docId);
        await updateDoc(docRef, data);
        console.log("Document updated with ID:", docId);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

// Function to delete a document
export async function firestoreDeleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(firestore, collectionName, docId));
        console.log("Document deleted with ID:", docId);
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}

export async function firebaseGetDropdownData(
    collectionName,
    labelField,
    valueField
) {
    try {
        const documents = await firestoreGetDocuments(collectionName);
        const options = documents.map((doc) => ({
            label: doc[labelField],
            value: doc[valueField],
        }));
        return options;
    } catch (error) {
        console.error("Error fetching dropdown data:", error);
        throw error;
    }
}

export async function firebaseCreateContract(contractData) {
    try {
        await firestoreCreateDocument("contracts", contractData);
    } catch (error) {
        console.error("Error creating contract:", error);
        throw error;
    }
}

export async function firebaseReadDocument(collectionName, docId) {
    try {
        const document = await firestoreGetDocument(collectionName, docId);
        if (document) {
            console.log(
                "Document read successfully from",
                collectionName + "/" + docId
            );
            return document;
        } else {
            console.log("No such document in", collectionName + "/" + docId);
            return null;
        }
    } catch (error) {
        console.error("Error reading document:", error);
        throw error;
    }
}

export async function firebaseUpdateDocument(collectionName, docId, data) {
    try {
        await firestoreUpdateDocument(collectionName, docId, data);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

export { firestore }; // Export the firestore instance
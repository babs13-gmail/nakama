// ============================================
// AUTHENTIFICATION NAKAMA — Firebase Auth + Firestore
//
// ⚠️ ÉTAPE OBLIGATOIRE : crée un NOUVEAU projet Firebase
// (différent de celui du mémorial) appelé par exemple "nakama",
// puis colle sa config ci-dessous. Active aussi "Authentication
// → Sign-in method → Email/Password" dans la console Firebase.
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "COLLE_TA_CLE_API_ICI",
  authDomain: "COLLE_TON_AUTH_DOMAIN_ICI",
  projectId: "COLLE_TON_PROJECT_ID_ICI",
  storageBucket: "COLLE_TON_STORAGE_BUCKET_ICI",
  messagingSenderId: "COLLE_TON_SENDER_ID_ICI",
  appId: "COLLE_TON_APP_ID_ICI"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---- Éléments du DOM ----
const navAccountBtn = document.getElementById("navAccountBtn");
const profilLoggedOut = document.getElementById("profilLoggedOut");
const profilLoggedIn = document.getElementById("profilLoggedIn");
const profilPseudo = document.getElementById("profilPseudo");
const logoutBtn = document.getElementById("logoutBtn");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginStatus = document.getElementById("loginStatus");
const signupStatus = document.getElementById("signupStatus");

// ============================================
// INSCRIPTION
// ============================================
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pseudo = document.getElementById("signupPseudo").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const pays = document.getElementById("signupPays").value;
  const age = document.getElementById("signupAge").value;
  const sexe = document.getElementById("signupSexe").value;

  signupStatus.textContent = "Création du compte...";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // On attache le pseudo au compte Firebase Auth lui-même
    await updateProfile(cred.user, { displayName: pseudo });

    // Et on stocke les infos démographiques dans Firestore
    // (jamais liées publiquement à un profil, utilisées en agrégat uniquement)
    await setDoc(doc(db, "users", cred.user.uid), {
      pseudo,
      pays,
      age,
      sexe,
      createdAt: new Date().toISOString()
    });

    signupStatus.textContent = "";
    document.getElementById("authModal").classList.remove("is-open");
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use") {
      signupStatus.textContent = "Cet email est déjà utilisé.";
    } else if (err.code === "auth/weak-password") {
      signupStatus.textContent = "Mot de passe trop court (6 caractères min.)";
    } else {
      signupStatus.textContent = "Erreur, réessaie.";
    }
  }
});

// ============================================
// CONNEXION
// ============================================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  loginStatus.textContent = "Connexion...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginStatus.textContent = "";
    document.getElementById("authModal").classList.remove("is-open");
  } catch (err) {
    console.error(err);
    loginStatus.textContent = "Email ou mot de passe incorrect.";
  }
});

// ============================================
// DÉCONNEXION
// ============================================
logoutBtn.addEventListener("click", () => signOut(auth));

// ============================================
// ÉTAT DE CONNEXION — met à jour l'interface partout
// ============================================
onAuthStateChanged(auth, (user) => {
  if (user) {
    navAccountBtn.textContent = user.displayName || "Mon compte";
    profilLoggedOut.hidden = true;
    profilLoggedIn.hidden = false;
    profilPseudo.textContent = user.displayName || "otaku";
  } else {
    navAccountBtn.textContent = "Se connecter";
    profilLoggedOut.hidden = false;
    profilLoggedIn.hidden = true;
  }
});

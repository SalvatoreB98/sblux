export class TryOn {
  constructor() {
    document.getElementById("cat")?.addEventListener("click", () => {
      console.log("Try-On AR Attivato!");
    });
  }
}
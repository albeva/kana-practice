export {};

declare global {
    interface Array<T> {
        randomElement(): T;
    }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
};

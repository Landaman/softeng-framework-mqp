/**
 * Class for even requests
 */
export class EvenRequest {
    /**
     * Initializes an even request, sets the number to use
     * @param number the number to use
     */
    constructor(number: number) {
        this.number = number;
    }

    number: number;
}

/**
 * Class for even responses
 */
export class EvenResponse {
    /**
     * Initializes an even response, sets the boolean value
     * @param isEven whether the response is even
     */
    constructor(isEven: boolean) {
        this.isEven = isEven;
    }

    isEven: boolean;
}
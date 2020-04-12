import BaseMiddleware from "./BaseMiddleware";
import {ObjectId} from "mongodb";
import Tools from "../tools";
import NigCache from "../cache/NigCache";
import NigWrapper from "../database/wrapper/NigWrapper";
import Nig from "../database/model/Nig";

export default class NigMiddleware extends BaseMiddleware{
    readonly nigCache : NigCache;
    readonly nigWrapper : NigWrapper;
    cacheBuilt : boolean;

    constructor() {
        super();
        this.nigCache = new NigCache();
        this.nigWrapper = new NigWrapper();
    }

    async buildCache(): Promise<void> {
        this.nigCache.setCache(await this.nigWrapper.getNig());
        this.cacheBuilt = true
    }

    getNig(userId : string, isBigMan : boolean) : Nig {
        if (this.nigCache.generatedNig.has(userId)) return this.nigCache.generatedNig.get(userId);

        //Generate the nig
        let randomNumber: number;
        if (isBigMan) randomNumber = Tools.getRandomNumber(0, 100);
        else randomNumber = Tools.getRandomNumber(0, 50);

        let newNig = new Nig(userId, randomNumber, new Date());
        newNig._id = new ObjectId();
        //Generate the nig

        this.nigCache.generatedNig.set(userId, newNig);
        this.nigWrapper.addNig(newNig).catch(error => console.log(error));

        return newNig;
    }

    updateNigAmount(userId : string, isBigMan : boolean, newAmount : number) : void{
        let nig = this.getNig(userId, isBigMan); //Get the PeePee

        //New PeePee size
        nig.amount = newAmount;
        this.nigWrapper.modifyNig(nig).catch((error) => console.log(error));
        //New PeePee size
    }
}
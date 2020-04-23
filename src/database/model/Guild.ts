import {ObjectId} from 'mongodb';

export default class Guild {
    _id: ObjectId;
    readonly guild: string;

    quoteSubmission: string;
    quoteChannel: string;

    roastSubmission: string;
    insultSubmission: string;

    constructor(guild: string) {
        this.guild = guild;
    }

    static modelBuilder(object: any): Guild {
        let guild = new Guild(object.guild);

        if (object.quoteSubmission !== undefined) guild.quoteSubmission = object.quoteSubmission;
        if (object.quoteChannel !== undefined) guild.quoteChannel = object.quoteChannel;
        if (object.roastSubmission !== undefined) guild.roastSubmission = object.roastSubmission;
        if (object.insultSubmission !== undefined) guild.insultSubmission = object.insultSubmission;

        if (object._id !== undefined) guild._id = object._id;
        else guild._id = new ObjectId();

        return guild;
    }

    toString(): object {
        return {
            _id: this._id,
            guild: this.guild,
            quoteSubmission: this.quoteSubmission,
            quoteChannel: this.quoteChannel,
            roastSubmission: this.roastSubmission,
            insultSubmission: this.insultSubmission
        }
    }
}
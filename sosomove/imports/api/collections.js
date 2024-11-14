import { Mongo } from 'meteor/mongo';

export const Accounts = new Mongo.Collection('account');
export const CollectionRequest = new Mongo.Collection('request');
export const CollectionEstCar = new Mongo.Collection('estcar');
export const CollectionEstHelper = new Mongo.Collection('esthelper');
export const Collectionestimate = new Mongo.Collection('estimate');
export const CollectionEstConfirm = new Mongo.Collection('estconfirm');
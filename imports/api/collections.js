import { Mongo } from 'meteor/mongo';

export const CollectionRequest = new Mongo.Collection('request'); //(user) 기본 견적 요청서
export const CollectionEstimate = new Mongo.Collection('estimate'); //사업자 견적서
export const Notifications = new Mongo.Collection('notifications'); //알림
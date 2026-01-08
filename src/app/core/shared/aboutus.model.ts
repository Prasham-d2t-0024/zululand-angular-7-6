import { typedObject } from '../cache/builders/build-decorators';
import { ResourceType } from './resource-type';
import { REGISTRATION } from './registration.resource-type';
import { UnCacheableObject } from './uncacheable-object.model';
import { ABOUTUS } from './aboutus.resource-type';
import { autoserialize } from 'cerialize';

@typedObject
export class AboutUs implements UnCacheableObject {
  static type = ABOUTUS;
  @autoserialize
  id: string;
  @autoserialize
  uuid: string;
  @autoserialize
  texteditor: string;

}

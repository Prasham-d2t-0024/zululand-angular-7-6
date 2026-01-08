import { autoserialize, deserialize, deserializeAs, inheritSerialization } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { IDToUUIDSerializer } from '../cache/id-to-uuid-serializer';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { BitstreamFormatSupportLevel } from './bitstream-format-support-level';
import { CONTACT } from './contacts.resource-type';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { DSpaceObject } from './dspace-object.model';
import { EPerson } from '../eperson/models/eperson.model';
import { Item } from './item.model';
import { ChildHALResource } from './child-hal-resource.model';
import { Bitstream } from './bitstream.model';
/**
 * Model class for a Bitstream Format
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class Contact extends DSpaceObject {
    static type = CONTACT;
    @autoserialize
    question: string;
    @autoserialize
    description: string;
    @autoserialize
    email: string;
    @autoserialize
    firstname: string;
    @autoserialize
    lastname: string;
    /**
     * String representing the MIME type of this Bitstream Format
     */
    @autoserialize
    bitstreamrRest: Bitstream;

   
    /**
     * The {@link HALLink}s for this BitstreamFormat
     */
    @deserialize
    _links: {
        self: HALLink;
    };
}

import { molecule, number, createFixedBytesCodec, bytes } from '@ckb-lumos/codec';
import { OutPoint, Output } from '@ckb-lumos/lumos';
import { BytesCodec } from '@ckb-lumos/codec/lib/base';
import { concat } from '@ckb-lumos/codec/lib/bytes';
import { assertMinBufferLength, assertBufferLength } from '@ckb-lumos/codec/lib/utils';
import { CONFIG } from './config';

const { struct } = molecule;
const { Uint8, Uint16BE, Uint32BE } = number;

export { Uint16BE };

export function byteBEVecOf<T>(codec: BytesCodec<T>): BytesCodec<T> {
    return {
        pack(unpacked) {
            const payload = codec.pack(unpacked);
            const header = Uint16BE.pack(payload.byteLength);

            return concat(header, payload);
        },
        unpack(packed) {
            assertMinBufferLength(packed, 2);
            const header = Uint16BE.unpack(packed.slice(0, 2));
            assertBufferLength(packed.slice(2), header);
            return codec.unpack(packed.slice(2));
        }
    };
}

export enum NFTCellConfigureFlags {
    Claimable,
    Lockability,
    Inscription,
    Reserved,
    ExchangeableBeforeClaim,
    ExchangeableAfterClaim,
    DestructibleBeforeClaim,
    DestructibleAfterClaim
}

export const NFTCell = struct(
    {
        version: Uint8,
        characteristic: createFixedBytesCodec({
            byteLength: 8,
            pack: hex => bytes.bytify(hex),
            unpack: buf => bytes.hexify(buf)
        }),
        configure: Uint8,
        state: Uint8
    },
    ['version', 'characteristic', 'configure', 'state']
);

export const NFTTypeArgs = struct(
    {
        issuerId: createFixedBytesCodec({
            byteLength: 20,
            pack: hex => bytes.bytify(hex),
            unpack: buf => bytes.hexify(buf)
        }),
        classId: Uint32BE,
        tokenId: Uint32BE
    },
    ['issuerId', 'classId', 'tokenId']
);

export const NFTClassCellData = struct(
    {
        version: Uint8,
        total: Uint32BE,
        issued: Uint32BE,
        configure: Uint8
    },
    ['version', 'total', 'issued', 'configure']
);

export const NFTIssuerCellData = struct(
    {
        version: Uint8,
        classCount: Uint32BE,
        setCount: Uint32BE,
        infoSize: Uint16BE
    },
    ['version', 'classCount', 'setCount', 'infoSize']
);

export type CkbIndexerCell = {
    block_number: string;
    out_point: OutPoint;
    output: Output;
    output_data: string;
    tx_index: string;
};

export class SimpleRequestCache {
    private _storage = new Map<string, any>();

    saveRequest(key: string, value: any) {
        this._storage.set(key, value);
    }

    loadRequest(key: string) {
        return this._storage.get(key);
    }
}

export type NFT_TYPE = '' | 'Character' | 'Scene' | 'Item' | 'Special';

export const ContractMap = {
    Character: CONFIG.L2_CHARACTER_ADDRESS,
    Scene: CONFIG.L2_SCENE_ADDRESS,
    Item: CONFIG.L2_ITEM_ADDRESS,
    Special: CONFIG.L2_SPECIAL_ADDRESS
};

export class NFT {
    id = '';

    name = '';

    type: NFT_TYPE = '';

    storyId: string[] = [];

    bannerUrl = '';

    mibaoUrl = '';

    kollectMeUrl = '';

    index = -1;

    featured = false;

    publish = false;

    latest = false;

    // ===== > info from mibao
    description = '';

    issued = '';

    renderer = '';

    cover_image_url = '';

    image = '';

    uuid = '';

    total = '';

    is_banned = false;

    origin = '';

    short_name = '';

    birthday = '';

    card_background = '';

    job = '';

    showId?: string = '';

    formatId?: string = '';

    address = '';

    contract?: string = '';

    yokaiUrl?: string = '';
}

export enum NFT_TYPE_VALUE {
    Character = 1,
    Item = 3,
    Scene = 4,
    Special = 9
}

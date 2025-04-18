// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let callMain: any;
    namespace FS {
        export { ErrnoError };
        export function handleError(returnValue: any): any;
        export function createDataFile(parent: any, name: any, fileData: any, canRead: any, canWrite: any, canOwn: any): void;
        export function createPath(parent: any, path: any, canRead: any, canWrite: any): any;
        export function createPreloadedFile(parent: any, name: any, url: any, canRead: any, canWrite: any, onload: any, onerror: any, dontCreateFile: any, canOwn: any, preFinish: any): any;
        export function readFile(path: any, opts?: {}): any;
        export function cwd(): any;
        export function analyzePath(path: any): {
            exists: boolean;
            object: {
                contents: any;
            };
        };
        export function mkdir(path: any, mode: any): any;
        export function mkdirTree(path: any, mode: any): any;
        export function rmdir(path: any): any;
        export function open(path: any, flags: any, mode?: number): any;
        export function create(path: any, mode: any): any;
        export function close(stream: any): any;
        export function unlink(path: any): any;
        export function chdir(path: any): any;
        export function read(stream: any, buffer: any, offset: any, length: any, position: any): any;
        export function write(stream: any, buffer: any, offset: any, length: any, position: any, canOwn: any): any;
        export function writeFile(path: any, data: any): any;
        export function mmap(stream: any, length: any, offset: any, prot: any, flags: any): {
            ptr: any;
            allocated: boolean;
        };
        export function msync(stream: any, bufferPtr: any, offset: any, length: any, mmapFlags: any): any;
        export function munmap(addr: any, length: any): any;
        export function symlink(target: any, linkpath: any): any;
        export function readlink(path: any): any;
        export function statBufToObject(statBuf: any): {
            dev: any;
            mode: any;
            nlink: any;
            uid: any;
            gid: any;
            rdev: any;
            size: any;
            blksize: any;
            blocks: any;
            atime: any;
            mtime: any;
            ctime: any;
            ino: any;
        };
        export function stat(path: any): any;
        export function lstat(path: any): any;
        export function chmod(path: any, mode: any): any;
        export function lchmod(path: any, mode: any): any;
        export function fchmod(fd: any, mode: any): any;
        export function utime(path: any, atime: any, mtime: any): any;
        export function truncate(path: any, len: any): any;
        export function ftruncate(fd: any, len: any): any;
        export function findObject(path: any): {
            isFolder: boolean;
            isDevice: boolean;
        };
        export function readdir(path: any): any;
        export function mount(type: any, opts: any, mountpoint: any): any;
        export function unmount(mountpoint: any): any;
        export function mknod(path: any, mode: any, dev: any): any;
        export function makedev(ma: any, mi: any): number;
        export function registerDevice(dev: any, ops: any): void;
        export function createDevice(parent: any, name: any, input: any, output: any): any;
        export function mkdev(path: any, mode: any, dev: any): any;
        export function rename(oldPath: any, newPath: any): any;
        export function llseek(stream: any, offset: any, whence: any): any;
    }
    let FS_createPath: any;
    function FS_createDataFile(parent: any, name: any, fileData: any, canRead: any, canWrite: any, canOwn: any): void;
    function FS_createPreloadedFile(parent: any, name: any, url: any, canRead: any, canWrite: any, onload: any, onerror: any, dontCreateFile: any, canOwn: any, preFinish: any): void;
    function FS_unlink(path: any): any;
    let addRunDependency: any;
    let removeRunDependency: any;
}
declare class ErrnoError extends Error {
    constructor(code: any);
    errno: any;
}
interface WasmModule {
  _main(_0: number, _1: number): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;

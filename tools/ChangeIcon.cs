using System;
using System.IO;
using System.Runtime.InteropServices;

class Program {
    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    static extern IntPtr BeginUpdateResource(string pFileName, bool bDeleteExistingResources);

    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool UpdateResource(IntPtr hUpdate, IntPtr lpType, IntPtr lpName, ushort wLanguage, byte[] lpData, uint cbData);

    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool EndUpdateResource(IntPtr hUpdate, bool fDiscard);

    static int Main(string[] args) {
        if (args.Length < 2) {
            Console.WriteLine("Usage: ChangeIcon <exePath> <icoPath>");
            return 1;
        }

        string exePath = Path.GetFullPath(args[0]);
        string icoPath = Path.GetFullPath(args[1]);

        if (!File.Exists(exePath) || !File.Exists(icoPath)) {
            Console.WriteLine("File not found.");
            return 1;
        }

        byte[] icoBytes = File.ReadAllBytes(icoPath);
        using (MemoryStream ms = new MemoryStream(icoBytes))
        using (BinaryReader reader = new BinaryReader(ms)) {
            ushort reserved = reader.ReadUInt16();
            ushort type = reader.ReadUInt16();
            ushort count = reader.ReadUInt16();

            if (type != 1) {
                Console.WriteLine("Invalid ICO file.");
                return 1;
            }

            IntPtr hUpdate = BeginUpdateResource(exePath, false);
            if (hUpdate == IntPtr.Zero) {
                Console.WriteLine("BeginUpdateResource failed: " + Marshal.GetLastWin32Error());
                return 1;
            }

            // GRPICONDIR is 6 bytes + count * 14 bytes
            byte[] grpBytes = new byte[6 + count * 14];
            using (MemoryStream grpMs = new MemoryStream(grpBytes))
            using (BinaryWriter grpWriter = new BinaryWriter(grpMs)) {
                grpWriter.Write(reserved);
                grpWriter.Write(type);
                grpWriter.Write(count);

                for (int i = 0; i < count; i++) {
                    ms.Seek(6 + i * 16, SeekOrigin.Begin);
                    byte bWidth = reader.ReadByte();
                    byte bHeight = reader.ReadByte();
                    byte bColorCount = reader.ReadByte();
                    byte bReserved = reader.ReadByte();
                    ushort wPlanes = reader.ReadUInt16();
                    ushort wBitCount = reader.ReadUInt16();
                    uint dwBytesInRes = reader.ReadUInt32();
                    uint dwImageOffset = reader.ReadUInt32();

                    // Read image data
                    byte[] imgData = new byte[dwBytesInRes];
                    Array.Copy(icoBytes, dwImageOffset, imgData, 0, dwBytesInRes);

                    ushort iconId = (ushort)(i + 1);

                    // Update RT_ICON (type 3)
                    bool res = UpdateResource(hUpdate, (IntPtr)3, (IntPtr)iconId, 0, imgData, (uint)dwBytesInRes);
                    if (!res) {
                        Console.WriteLine("UpdateResource RT_ICON failed: " + Marshal.GetLastWin32Error());
                        EndUpdateResource(hUpdate, true);
                        return 1;
                    }

                    // Write GRPICONDIRENTRY
                    grpWriter.Write(bWidth);
                    grpWriter.Write(bHeight);
                    grpWriter.Write(bColorCount);
                    grpWriter.Write(bReserved);
                    grpWriter.Write(wPlanes);
                    grpWriter.Write(wBitCount);
                    grpWriter.Write(dwBytesInRes);
                    grpWriter.Write(iconId);
                }
            }

            // Update RT_GROUP_ICON (type 14), name 1
            bool groupRes = UpdateResource(hUpdate, (IntPtr)14, (IntPtr)1, 0, grpBytes, (uint)grpBytes.Length);
            if (!groupRes) {
                Console.WriteLine("UpdateResource RT_GROUP_ICON failed: " + Marshal.GetLastWin32Error());
                EndUpdateResource(hUpdate, true);
                return 1;
            }

            bool endRes = EndUpdateResource(hUpdate, false);
            if (!endRes) {
                Console.WriteLine("EndUpdateResource failed: " + Marshal.GetLastWin32Error());
                return 1;
            }
        }

        Console.WriteLine("Icon replaced successfully in " + exePath);
        return 0;
    }
}

using System;
using System.IO;
using System.Text;

class PatchImpulsBinary
{
    static int Main(string[] args)
    {
        string exePath = args.Length > 0 ? args[0] : "Telegram/Telegram.exe";
        string outPath = args.Length > 1 ? args[1] : "Telegram/Impuls.exe";

        if (!File.Exists(exePath))
        {
            Console.Error.WriteLine("Source binary not found: " + exePath);
            return 1;
        }

        Console.WriteLine(string.Format("Patching {0} -> {1}...", exePath, outPath));
        byte[] bytes = File.ReadAllBytes(exePath);

        byte[] targetIpBytes = Encoding.ASCII.GetBytes("80.201.130.248\0");
        uint targetPort = 20443;
        ulong targetVA = 0x148730180UL;

        // 1. Write IP string at 0x872f380
        Array.Copy(targetIpBytes, 0, bytes, 0x872f380, targetIpBytes.Length);

        // 2. Overwrite all IP strings in .rdata table
        int[] ipOffsets = { 0x872f298, 0x872f2a8, 0x872f2b8, 0x872f340, 0x872f350, 0x872f360, 0x872f370, 0x872f380 };
        foreach (int off in ipOffsets)
        {
            Array.Copy(targetIpBytes, 0, bytes, off, targetIpBytes.Length);
        }

        // 3. Patch kBuiltInDcs (0x7c07a60) - 6 entries
        for (int i = 0; i < 6; i++)
        {
            int entryOffset = 0x7c07a60 + i * 24;
            BitConverter.GetBytes(targetVA).CopyTo(bytes, entryOffset + 8);
            BitConverter.GetBytes(targetPort).CopyTo(bytes, entryOffset + 16);
        }

        // 4. Patch kBuiltInDcsTest (0x7c07990) - 3 entries
        for (int i = 0; i < 3; i++)
        {
            int entryOffset = 0x7c07990 + i * 24;
            BitConverter.GetBytes(targetVA).CopyTo(bytes, entryOffset + 8);
            BitConverter.GetBytes(targetPort).CopyTo(bytes, entryOffset + 16);
        }

        // 5. Patch kBuiltInDcsIPv6 (0x7c079f8) - 4 entries
        for (int i = 0; i < 4; i++)
        {
            int entryOffset = 0x7c079f8 + i * 24;
            BitConverter.GetBytes(targetVA).CopyTo(bytes, entryOffset + 8);
            BitConverter.GetBytes(targetPort).CopyTo(bytes, entryOffset + 16);
        }

        // 6. Replace RSA keys at 0x872f560 and 0x872f710
        string key = "-----BEGIN RSA PUBLIC KEY-----\n" +
            "MIIBCgKCAQEAu+3tvscWDAlEvVylTeMr5FpU2AjgqzoQHPjzp69r0YAtq0a8rX0M\n" +
            "Ue78F/FRAqBaEbZW6WBzF3AjOlNYpOtvvwGhl9rGCgziunbd9nwcKJBMDWS9O7Mz\n" +
            "/8xjz/swIB4V56XcjOhrjUHJ/GniFKoum00xeEcYnr5xnLesvpVMq97Ga6b+xt3H\n" +
            "RftHY/Zy1dG5zs8upuiAOlEiKilhu1IthfMjFG3NF6TiGrO9YU3YixFbJy67jtHk\n" +
            "v5FarscM2fC5iWQ2eP1y6jXR64sGU3QjncvozYOePrH9jGcnmzUmj42x/H28IjJQ\n" +
            "9EjEc22sPOuauK0IF2QiCGh+TfsKCK189wIDAQAB\n" +
            "-----END RSA PUBLIC KEY-----";

        byte[] keyBytes = Encoding.ASCII.GetBytes(key);
        Array.Copy(keyBytes, 0, bytes, 0x872f560, keyBytes.Length);
        Array.Copy(keyBytes, 0, bytes, 0x872f710, keyBytes.Length);

        // 7. Replace FileDescription & ProductName (UTF-16LE)
        byte[] oldName = Encoding.Unicode.GetBytes("Telegram Desktop\0");
        byte[] newName = Encoding.Unicode.GetBytes("Impuls Desktop\0\0\0");
        ReplaceBytes(bytes, oldName, newName);

        // 8. Replace CompanyName (UTF-16LE)
        byte[] oldCompany = Encoding.Unicode.GetBytes("Telegram FZ-LLC\0");
        byte[] newCompany = Encoding.Unicode.GetBytes("Impuls Team\0\0\0\0\0");
        ReplaceBytes(bytes, oldCompany, newCompany);

        File.WriteAllBytes(outPath, bytes);
        Console.WriteLine(string.Format("Successfully generated {0} ({1} bytes).", outPath, bytes.Length));
        return 0;
    }

    static void ReplaceBytes(byte[] src, byte[] search, byte[] repl)
    {
        for (int i = 0; i <= src.Length - search.Length; i++)
        {
            bool match = true;
            for (int j = 0; j < search.Length; j++)
            {
                if (src[i + j] != search[j])
                {
                    match = false;
                    break;
                }
            }
            if (match)
            {
                Array.Copy(repl, 0, src, i, repl.Length);
                i += search.Length - 1;
            }
        }
    }
}

/*获取手机内存信息*/
export function getMemorySize() {
  var memoryInfo = '';
  if (plus.os.name == "Android") {
    var Context = plus.android.importClass("android.content.Context");
    var ActivityManager = plus.android.importClass("android.app.ActivityManager");
    var mi = new ActivityManager.MemoryInfo();
    var activityService = plus.android.runtimeMainActivity().getSystemService(Context.ACTIVITY_SERVICE);
    activityService.getMemoryInfo(mi);
    memoryInfo = mi.plusGetAttribute("availMem");
  }
  return memoryInfo;
}

/*获取手机内部总的存储空间*/
export function getTotalInternalMemorySize() {
  var internalMemSize = 0;
  if (plus.os.name == "Android") {
    var environment = plus.android.importClass("android.os.Environment");
    var statFs = plus.android.importClass("android.os.StatFs");
    var files = plus.android.importClass("java.io.File");

    var Files = environment.getDataDirectory();
    var StatFs = new statFs(Files.getPath());
    var blockSize = parseFloat(StatFs.getBlockSize());
    var blockCount = parseFloat(StatFs.getBlockCount());
    internalMemSize = blockSize * blockCount;
  }
  return internalMemSize;
}

/*获取总内存*/
export function getTotalRamSize() {
  var memInfo = '/proc/meminfo';
  var temp = '',
    ramSize = '',
    arrays, initMemory;
  var fileReader = plus.android.importClass("java.io.FileReader");
  var bufferedReader = plus.android.importClass("java.io.BufferedReader");
  var FileReader = new fileReader(memInfo);
  var BufferedReader = new bufferedReader(FileReader, 8192);
  while ((temp = BufferedReader.readLine()) != null) {
    if (-1 != temp.indexOf('MemTotal:')) {
      var value = temp.replace(/[^0-9]/ig, "");
      ramSize = Math.floor(parseInt(value) / (1024));
    }
  }

  return ramSize;
}

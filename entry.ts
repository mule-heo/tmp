import { exec } from "child_process";

const commands = ["next start -p 6120", "tsx src/lib/cron.ts"];

commands.forEach((command) => {
  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  child.stdout?.on("data", (data) => {
    console.log(data.toString().trim());
  });

  child.stderr?.on("data", (data) => {
    console.error(data.toString().trim());
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

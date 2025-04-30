**1D VES Inversion Tool (Electron.js)**
A desktop application for performing 1D Vertical Electrical Sounding (VES) inversions using field-acquired resistivity data. Built with Electron.js, this tool allows geophysicists and researchers to model subsurface structures based on the Schlumberger array configuration.

**✨ Features**
Interactive GUI for entering AB/2 distances and resistivity values.

Supports branch-based data entry for comparative analysis.

Real-time model curve plotting and fit visualization.

Inversion based on the Levenberg-Marquardt algorithm.

Forward modeling using the Lyman-Landisman filter coefficients.

Displays RMSE and predicted subsurface layer parameters.

**Screenshots**
🧾Data Entry Interface
Users enter data in branches for multiple measurements:

![image](https://github.com/user-attachments/assets/9a2802f9-dd28-4775-84ee-5cd7de636f56)



📈 Inversion Plot
Fit between observed (black dots) and modeled (red curve) resistivity values:

![image](https://github.com/user-attachments/assets/71fe8ab0-6dca-47e6-853f-0b5c742aee34)


Model Parameters
Predicted resistivity and thickness values after inversion:

![image](https://github.com/user-attachments/assets/faddac19-4b17-466a-9e07-be20ddfe41a8)


 **About**
Vertical Electrical Sounding is a geophysical method used to infer subsurface resistivity profiles. This software provides a convenient desktop-based interface for interpreting such data via 1D inversion techniques. While the results are theoretical approximations, they offer valuable insights for further geophysical or geological investigations.

Currently, only Windows is supported and only the Schlumberger configuration is implemented.

**🚀 Getting Started**
Coming soon. For now, clone the repo and run using:

bash
Copy
Edit
npm install
npm start
📌 Roadmap
 Import data from excel and DAT files

 Add support for Wenner and Dipole-Dipole arrays

 Export results to CSV/PDF

 Cross-platform support (macOS)

 Allow users to upload and run custom VES inversion MATLAB code.

**🛠️ Built With**
Electron.js

Custom 1D inversion engine using Levenberg-Marquardt

Math.js

D3.js 

📄 License
MIT — free for educational and research use.









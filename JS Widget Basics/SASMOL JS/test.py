import sasmol.system as system
molecule = system.Molecule(filename = 'hiv1_gag.pdb')
print(molecule.coor())

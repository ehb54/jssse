from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
#from __future__ import unicode_literals
#
#    SASMOL: Copyright (C) 2011 Joseph E. Curtis, Ph.D.
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#   SYSTEM
#
#	12/4/2009	--	initial coding			:	jc
#	12/10/2009	--	doc strings 			:	jc
#	01/11/2010	--	new design pattern		:	jc
#	12/25/2015	--	refactored for release  :   jc
#	07/23/2016	--	refactored for Python 3 :   jc
#	08/19/2016	--	added doc strings       :   jc
#
#	 1         2         3         4         5         6         7
# LC4567890123456789012345678901234567890123456789012345678901234567890123456789
#								       *      **
'''
	System is the main module that contains the base classes that
	describe the objects in the system.  An instance of the system
	can be created of Atom, Molecule, or System classes.

	For purely atomic based systems, a set of utilities are provided
	to hold information, to calculate properties, and to manipulate
	the structures in space.  In addition, basic file input / output
	is provided in the Mol class (and inherited up the classes
	as dictated by the calling code).

'''

import sys
import os
import numpy
import sasmol.file_io as file_io
import sasmol.calculate as calculate
import sasmol.operate as operate
import sasmol.subset as subset
import sasmol.properties as properties
import sasmol.topology as topology
import sasmol.view as view

import sasmol.config as config

class Atom(file_io.Files, calculate.Calculate, operate.Move, subset.Mask, properties.Atomic, topology.CharmmTopology, view.View):

    """ Base class containing methods to define system objects.

        Atom is the base class to build and deal with molecular systems.
        The class inherits file input/output, calcuation, manipulation, subset,
        atom properties, topology, and viewing from other samsol classes.

        Class has several initialization options

        Parameters
        ----------
        args
            optional integer : self._id

        kwargs
            optional keyword arguments
            {
                string filename (filename = 'hiv1_gag.pdb') : default = None
                integet id (id=3) : default = 0
                boolean debug (debug = True) : default = None

            }

        Returns
        -------
        system object
            if called with string (or with filename kwarg) returns
            an initialized system object with data read in using
            file_io.read_pdb()

        Examples
        -------

        Define instance of class and read in PDB file at same time

        >>> import sasmol.system as system
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb')

        Other instance definition examples (not-exhaustive)

        >>> molecule = system.Molecule()
        >>> molecule = system.Molecule(id=7)
        >>> molecule = system.Molecule(debug=True)
        >>> molecule = system.Molecule('hiv1_gag.pdb')
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb', id=0, debug=False)

        Example of how setters and getters work.  Below, the original index
        values are adjusted by a value (-10) and setIndex() is used to assign
        the new list to the molecule

        >>> molecule.index()[0]
        1
        >>> offset = -10
        >>> index = [x + offset for x in xrange(molecule.natoms())]
        >>> molecule.setIndex(index)
        >>> molecule.index()[0]
        -10

        Note
        ----

        `self` parameter is not shown in the ``Parameters`` section in the documentation


        Many "setters" and "getters" methods are defined in this class.  See source
        code for details.

    """

    def __init__(self, *args, **kwargs):
        self._filename = kwargs.pop('filename', None)
        self._id = kwargs.pop('id', 0)
        self._debug = kwargs.pop('debug', None)

        self._total_mass = 0.0
        self._natoms = 0
        self._mass = None
        self._coor = None
        self._com = None
        self._conect = []

        if config.__logging_level__ == 'DEBUG':
            self._debug = True

        self._defined_with_input_file = False
        argument_flag = True
        try:
            for argument in args:
                if(os.path.isfile(str(argument))):
                    try:
                        self.read_pdb(argument)
                        argument_flag = False
                        self._defined_with_input_file = True
                    except:
                        pass
                else:
                    self._id = argument
        except:
            argument_flag = False

        if self._filename and argument_flag:
            try:
                self.read_pdb(self._filename)
                self._defined_with_input_file = True
            except:
                pass

        self.setId(self._id)


    def __repr__(self):

        if self._filename and self._defined_with_input_file:
            return "sasmol object initialied with filename = " + self._filename
        else:
            return "sasmol object"

    def setId(self, newValue):
        self._id = newValue


    def id(self):
        return self._id


    def maketop(self):
        pass


    def setFilename(self, newValue):
        self._filename = newValue


    def filename(self):
        return self._filename


    def setType(self, newValue):
        self._type = newValue


    def type(self):
        return self._type


    def setCharmm_type(self, newValue):
        self._charmm_type = newValue


    def charmm_type(self):
        return self._charmm_type


        # file stuff

    def load(self):
        pass


    def delete(self):
        pass


    def save(self):
        pass


    def delframes(self):
        pass


        # properties

    def number_of_frames(self):
        return self._coor[:, 0, 0].shape[0]


    def setNumber_of_frames(self, newValue):
        self._number_of_frames = newValue


    def atom(self):
        return self._atom


    def setAtom(self, newValue):
        self._atom = newValue


    def index(self):
        return self._index


    def setIndex(self, newValue):
        self._index = newValue


    def header(self):
        return self._header


    def setHeader(self, newValue):
        self._header = newValue


    def original_index(self):
        return self._original_index


    def setOriginal_index(self, newValue):
        self._original_index = newValue


    def original_resid(self):
        return self._original_resid


    def setOriginal_resid(self, newValue):
        self._original_resid = newValue


    def conect(self):
        return self._conect


    def setConect(self, newValue):
        self._conect = newValue


    def residue_flag(self):
        try:
            return self._residue_flag
        except:
            self._residue_flag = False
            return self._residue_flag


    def setResidue_flag(self, newValue):
        self._residue_flag = newValue


    def name(self):
        return self._name


    def setName(self, newValue):
        self._name = newValue


    def loc(self):
        return self._loc


    def setLoc(self, newValue):
        self._loc = newValue


    def resname(self):
        return self._resname


    def setResname(self, newValue):
        self._resname = newValue


    def chain(self):
        return self._chain


    def setChain(self, newValue):
        self._chain = newValue


    def resid(self):
        return self._resid


    def setResid(self, newValue):
        self._resid = newValue


    def coor(self):
        return self._coor


    def setCoor(self, newValue):
        self._coor = newValue


    def rescode(self):
        return self._rescode


    def setRescode(self, newValue):
        self._rescode = newValue


    def occupancy(self):
        return self._occupancy


    def setOccupancy(self, newValue):
        self._occupancy = newValue


    def beta(self):
        return self._beta


    def setBeta(self, newValue):
        self._beta = newValue


    def segname(self):
        return self._segname


    def setSegname(self, newValue):
        self._segname = newValue


    def element(self):
        return self._element


    def setElement(self, newValue):
        self._element = newValue


    def charge(self):
        return self._charge


    def setCharge(self, newValue):
        self._charge = newValue


    def atom_charge(self):
        return self._atom_charge


    def setAtom_charge(self, newValue):
        self._atom_charge = newValue


    def atom_vdw(self):
        return self._atom_vdw


    def setAtom_vdw(self, newValue):
        self._atom_vdw = newValue


    def residue_charge(self):
        return self._residue_charge


    def setResidue_charge(self, newValue):
        self._residue_charge = newValue


    def energy(self):
        return self._energy


    def setEnergy(self, newValue):
        self._energy = newValue


    def formula(self):
        return self._formula


    def setFormula(self, newValue):
        self._formula = newValue


    def mass(self):
        return self._mass


    def setMass(self, newValue):
        self._mass = newValue


    def total_mass(self):
        if(self._total_mass == None):
            self._total_mass = calculate.Calculate.calcmass(self)
        return self._total_mass


    def setTotal_mass(self, newValue):
        self._total_mass = newValue


    def unitcell(self):
        return self._unitcell


    def setUnitcell(self, newValue):
        self._unitcell = newValue


    def com(self):
        return self._com


    def setCom(self, newValue):
        self._com = newValue


    def natoms(self):
        return self._natoms


    def setNatoms(self, newValue):
        self._natoms = newValue


    def rg(self):
        return self._rg


    def setRg(self, newValue):
        self._rg = newValue


    def pmi(self):
        return self._pmi


    def setPmi(self, newValue):
        self._pmi = newValue


    def minimum(self):
        return self._minimum


    def setMinimum(self, newValue):
        self._minimum = newValue


    def maximum(self):
        return self._maximum


    def setMaximum(self, newValue):
        self._maximum = newValue


    def shape(self):
        return self._shape


    def setShape(self, newValue):
        self._shape = newValue


    def moltype(self):
        return self._moltype


    def setMoltype(self, newValue):
        self._moltype = newValue


    def number_of_names(self):
        return self._number_of_names


    def setNumber_of_names(self, newValue):
        self._number_of_names = newValue


    def number_of_resnames(self):
        return self._number_of_resnames


    def setNumber_of_resnames(self, newValue):
        self._number_of_resnames = newValue


    def number_of_resids(self):
        return self._number_of_resids


    def setNumber_of_resids(self, newValue):
        self._number_of_resids = newValue


    def number_of_chains(self):
        return self._number_of_chains


    def setNumber_of_chains(self, newValue):
        self._number_of_chains = newValue


    def number_of_segnames(self):
        return self._number_of_segnames


    def setNumber_of_segnames(self, newValue):
        self._number_of_segnames = newValue


    def number_of_occupancies(self):
        return self._number_of_occupancies


    def setNumber_of_occupancies(self, newValue):
        self._number_of_occupancies = newValue


    def number_of_betas(self):
        return self._number_of_betas


    def setNumber_of_betas(self, newValue):
        self._number_of_betas = newValue


    def number_of_moltypes(self):
        return self._number_of_moltypes


    def setNumber_of_moltypes(self, newValue):
        self._number_of_moltypes = newValue


    def number_of_elements(self):
        return self._number_of_elements


    def setNumber_of_elements(self, newValue):
        self._number_of_elements = newValue


    def names(self):
        return self._names


    def setNames(self, newValue):
        self._names = newValue


    def resnames(self):
        return self._resnames


    def setResnames(self, newValue):
        self._resnames = newValue


    def resids(self):
        return self._resids


    def setResids(self, newValue):
        self._resids = newValue


    def chains(self):
        return self._chains


    def setChains(self, newValue):
        self._chains = newValue


    def segnames(self):
        return self._segnames


    def setSegnames(self, newValue):
        self._segnames = newValue


    def occupancies(self):
        return self._occupancies


    def setOccupancies(self, newValue):
        self._occupancies = newValue


    def betas(self):
        return self._betas


    def setBetas(self, newValue):
        self._betas = newValue


    def moltypes(self):
        return self._moltypes


    def setMoltypes(self, newValue):
        self._moltypes = newValue


    def elements(self):
        return self._elements


    def setElements(self, newValue):
        self._elements = newValue


    def names_mask(self):
        return self._names_mask


    def setNames_mask(self, newValue):
        self._names_mask = newValue


    def resnames_mask(self):
        return self._resnames_mask


    def setResnames_mask(self, newValue):
        self._resnames_mask = newValue


    def resids_mask(self):
        return self._resids_mask


    def setResids_mask(self, newValue):
        self._resids_mask = newValue


    def chains_mask(self):
        return self._chains_mask


    def setChains_mask(self, newValue):
        self._chains_mask = newValue


    def occupancies_mask(self):
        return self._occupancies_mask


    def setOccupancies_mask(self, newValue):
        self._occupancies_mask = newValue


    def betas_mask(self):
        return self._betas_mask


    def setBetas_mask(self, newValue):
        self._betas_mask = newValue


    def elements_mask(self):
        return self._elements_mask


    def setElements_mask(self, newValue):
        self._elements_mask = newValue


    def segnames_mask(self):
        return self._segnames_mask


    def setSegnames_mask(self, newValue):
        self._segnames_mask = newValue


    def effective_charge(self):
        return self._effective_charge


    def setEffective_charge(self, newValue):
        self._effective_charge = newValue


    def long_range_potential(self):
        return self._long_range_potential


    def setLong_range_potential(self, newValue):
        self._long_range_potential = newValue


    def short_range_potential(self):
        return self._short_range_potential


    def setShort_range_potential(self, newValue):
        self._short_range_potential = newValue


    def effective_van_der_waals(self):
        return self._effective_van_der_waals


    def setEffective_van_der_waals(self, newValue):
        self._effective_van_der_waals = newValue


    def fasta(self):
        return self._fasta


    def setFasta(self, newValue):
        self._fasta = newValue


    def one_letter_resname(self):
        return self._one_letter_resname


    def setOne_letter_resname(self, newValue):
        self._one_letter_resname = newValue


class Molecule(Atom):

    """
        Molecule is a class that is used to describe molecules. It inherits
        all of attributes from Atom.  An example of a molecule is
        a single protein, a single nucleic acid strand.

        Class has several initialization options

        Parameters
        ----------
        args
            optional integer : self._id

        kwargs
            optional keyword arguments
            {
                string filename (filename = 'hiv1_gag.pdb') : default = None
                integet id (id=3) : default = 0
                boolean debug (debug = True) : default = None

            }

        Returns
        -------
        system object
            if called with string (or with filename kwarg) returns
            an initialized system object with data read in using
            file_io.read_pdb()

        Examples
        -------

        >>> import sasmol.system as system
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb')


        >>> molecule = system.Molecule()
        >>> molecule = system.Molecule(id=7)
        >>> molecule = system.Molecule(debug=True)
        >>> molecule = system.Molecule('hiv1_gag.pdb')
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb', id=0, debug=False)

    """

    def __init__(self, *args, **kwargs):

        Atom.__init__(self, *args, **kwargs)


class System(Atom):

    """
        System is a class that is used to aggregate all components. It inherits
        all of attributes from Atom.

        Class has several initialization options

        Parameters
        ----------
        args
            optional integer : self._id

        kwargs
            optional keyword arguments
            {
                string filename (filename = 'hiv1_gag.pdb') : default = None
                integet id (id=3) : default = 0
                boolean debug (debug = True) : default = None

            }

        Returns
        -------
        system object
            if called with string (or with filename kwarg) returns
            an initialized system object with data read in using
            file_io.read_pdb()

        Examples
        -------

        >>> import sasmol.system as system
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb')


        >>> molecule = system.Molecule()
        >>> molecule = system.Molecule(id=7)
        >>> molecule = system.Molecule(debug=True)
        >>> molecule = system.Molecule('hiv1_gag.pdb')
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb', id=0, debug=False)

    """

    def __init__(self, *args, **kwargs):
        """
        Class has several initialization options

        Parameters
        ----------
        args
            optional integer : self._id

        kwargs
            optional keyword arguments
            {
                string filename (filename = 'hiv1_gag.pdb') : default = None
                integet id (id=3) : default = 0
                boolean debug (debug = True) : default = None

            }

        Returns
        -------
        system object
            if called with string (or with filename kwarg) returns
            an initialized system object with data read in using
            file_io.read_pdb()

        Examples
        -------

        >>> import sasmol.system as system
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb')


        >>> molecule = system.Molecule()
        >>> molecule = system.Molecule(id=7)
        >>> molecule = system.Molecule(debug=True)
        >>> molecule = system.Molecule('hiv1_gag.pdb')
        >>> molecule = system.Molecule(filename='hiv1_gag.pdb', id=0, debug=False)

        """
        Atom.__init__(self, *args, **kwargs)



class Molecule_Maker(Atom):
    """
        This class is used to define the minimum number of fields required to
        use within sasmol to use read_pdb() and write_pdb() methods in file_io.

        Default inputs are listed in the variables in __init__ and itemized below.
        The values are assigned to all atoms in the molecule.

        Once defined, attributes can be set using setters in the Atom class.

        Class has several initialization options

        Parameters
        ----------
        natoms
            integer : number of atoms in the molecule

        atom
            string  : name of ATOM keyword, typically either ATOM or HETATM

        index
            integer list : atom number

        name
            string : atom name

        loc
            string : alt loc

        resname
            string  : residue name

        chain
            string  : chain name

        resid
            integer list : residue number

        rescode
            string  : residue code

        coor
            numpy float array : x, y, z coordinates

        occupancy
            string  : occupancy value

        beta
            string  : beta value

        segname
            string  : segment name

        element
            string  : element name

        charge
            string  : element charge

        kwargs
            optional future arguments

        Returns
        -------
        system object

        Examples
        -------

        >>> import sasmol.system as system
        >>> molecule = system.Molecule_Maker(2048)
        >>> molecule = system.Molecule_Maker(2048, name='Ar')
        >>> molecule = system.Molecule_Maker(2048, name='Ar', segname='ARG0')
        >>> index = [x for x in xrange(340,1000)]
        >>> molecule = system.Molecule_Maker(660, name='Ar', index=index)
        >>> molecule.index()[0]
        340

    """

    def __init__(self, natoms, atom='ATOM', index=None, name='C', loc=' ',
        resname='DUM', chain='A', resid=None, rescode=' ', coor=None,
        occupancy='0.00', beta='0.00', segname='DUM', element='C', charge=' ', **kwargs):

        Atom.__init__(self)

        self._atom = [atom for x in xrange(natoms)]

        if index is not None:
            self._index = index
        else:
            self._index = numpy.array([x+1 for x in xrange(natoms)],numpy.int)

        self._name = [name for x in xrange(natoms)]
        self._loc = [loc for x in xrange(natoms)]
        self._resname = [resname for x in xrange(natoms)]
        self._chain = [chain for x in xrange(natoms)]

        if resid is not None:
            self._resid = resid
        else:
            self._resid = numpy.array([x+1 for x in xrange(natoms)],numpy.int)

        self._rescode = [rescode for x in xrange(natoms)]

        if coor is not None:
            self._coor = coor
        else:
            self._coor = numpy.zeros((1,natoms,3),numpy.float)

        self._occupancy = [occupancy for x in xrange(natoms)]
        self._beta = [beta for x in xrange(natoms)]
        self._charge = [charge for x in xrange(natoms)]
        self._segname = [segname for x in xrange(natoms)]
        self._element = [element for x in xrange(natoms)]

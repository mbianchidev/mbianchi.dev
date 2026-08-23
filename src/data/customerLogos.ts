import type { StaticImageData } from 'next/image'
import abl from '@/assets/customer-logos/abl.webp'
import allianz from '@/assets/customer-logos/all.webp'
import barilla from '@/assets/customer-logos/bar.webp'
import bmw from '@/assets/customer-logos/bmw.webp'
import coopolis from '@/assets/customer-logos/cpls.webp'
import dShare from '@/assets/customer-logos/dshr.webp'
import ecoMind from '@/assets/customer-logos/eco.webp'
import redHat from '@/assets/customer-logos/ext_rdht.webp'
import syncTune from '@/assets/customer-logos/free.webp'
import frontex from '@/assets/customer-logos/frx.webp'
import enel from '@/assets/customer-logos/gas.webp'
import gdf from '@/assets/customer-logos/gdf.webp'
import generali from '@/assets/customer-logos/gen.webp'
import github from '@/assets/customer-logos/ghb.webp'
import greenChic from '@/assets/customer-logos/grnc.webp'
import infocert from '@/assets/customer-logos/ice.webp'
import ing from '@/assets/customer-logos/ing.webp'
import leonardo from '@/assets/customer-logos/leo.webp'
import mentorCruise from '@/assets/customer-logos/mntcrs.webp'
import mvcTechnology from '@/assets/customer-logos/mvctch.webp'
import nki from '@/assets/customer-logos/nki.webp'
import omnistrate from '@/assets/customer-logos/omnistrate.svg'
import roar from '@/assets/customer-logos/roar.webp'
import reply from '@/assets/customer-logos/rpl.webp'
import replyPower from '@/assets/customer-logos/rpp.webp'
import tenutabene from '@/assets/customer-logos/ten.webp'
import unicredit from '@/assets/customer-logos/unc.webp'
import various from '@/assets/customer-logos/var.webp'
import vodafone from '@/assets/customer-logos/vod.webp'
import zefi from '@/assets/customer-logos/zef.webp'

export const customerLogos: Record<string, StaticImageData> = {
  ABL: abl,
  ALL: allianz,
  BAR: barilla,
  BMW: bmw,
  CPLS: coopolis,
  DSHR: dShare,
  ECO: ecoMind,
  EXT_RDHT: redHat,
  FREE: syncTune,
  FRX: frontex,
  GAS: enel,
  GDF: gdf,
  GEN: generali,
  GHB: github,
  GRNC: greenChic,
  ICE: infocert,
  ING: ing,
  LEO: leonardo,
  MNTCRS: mentorCruise,
  MVCTCH: mvcTechnology,
  NKI: nki,
  OMN: omnistrate,
  ROAR: roar,
  RPL: reply,
  RPP: replyPower,
  TEN: tenutabene,
  UNC: unicredit,
  VAR: various,
  VOD: vodafone,
  ZEF: zefi,
}

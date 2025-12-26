import dynamic from 'next/dynamic'
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer'
import { CVProps } from '@/types/CV'
import React from 'react'
import { themeColors, ThemeType } from './pdfTheme'

// Client-only viewer
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false })

interface PDFDocumentProps extends CVProps {
	theme: ThemeType
}

Font.register({
	family: 'Cereal',
	fonts: [
		{ src: '/fonts/AirbnbCereal_W_Lt.otf', fontWeight: 'light', fontStyle: 'normal' },
		{ src: '/fonts/AirbnbCereal_W_Md.otf', fontWeight: 'normal', fontStyle: 'normal' },
		{ src: '/fonts/AirbnbCereal_W_Bd.otf', fontWeight: 'bold', fontStyle: 'normal' },
		{ src: '/fonts/AirbnbCereal_W_XBd.otf', fontWeight: 'ultrabold', fontStyle: 'normal' }
	]
})

const PDFDocumentDense = ({ data, language, theme }: PDFDocumentProps) => {
	if (!data) return null

	const c = themeColors[theme] || themeColors.light

	const styles = StyleSheet.create({
		page: {
			paddingTop: 16,
			paddingBottom: 16,
			paddingLeft: 18,
			paddingRight: 18,
			backgroundColor: c.background,
			color: c.foreground,
			fontFamily: 'Cereal'
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-end',
			padding: 8,
			borderRadius: 6,
			backgroundColor: c.card,
			marginBottom: 10,
			borderBottomWidth: 1,
			borderBottomColor: c.accent
		},
		nameTitle: {
			flexDirection: 'column',
			gap: 2,
			maxWidth: '70%'
		},
		name: {
			fontSize: 18,
			fontWeight: 'ultrabold',
			color: c.accent
		},
		title: {
			fontSize: 11,
			fontWeight: 'bold',
			color: c.primary
		},
		subtitle: {
			fontSize: 9,
			color: c.primary
		},
		meta: {
			flexDirection: 'row',
			gap: 6,
			alignItems: 'center'
		},
		metaItem: {
			fontSize: 8,
			color: c.accent
		},
		body: {
			flexDirection: 'row',
			gap: 12
		},
		sidebar: {
			width: '36%',
			flexDirection: 'column',
			gap: 10
		},
		main: {
			width: '64%',
			flexDirection: 'column',
			gap: 10
		},
		section: {
			flexDirection: 'column',
			gap: 6,
			borderTopWidth: 1,
			borderTopColor: c.card,
			paddingTop: 6
		},
		sectionHeader: {
			fontSize: 11,
			fontWeight: 'bold',
			color: c.primary
		},
		row: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			gap: 6
		},
		left: {
			width: '40%',
			flexDirection: 'column',
			gap: 2
		},
		right: {
			width: '60%',
			flexDirection: 'column',
			gap: 2
		},
		itemTitle: {
			fontSize: 10,
			fontWeight: 'bold',
			color: c.primary
		},
		period: {
			fontSize: 8,
			color: c.accent
		},
		desc: {
			fontSize: 8,
			lineHeight: 1.3
		},
		descDash: {
			fontSize: 8,
			marginLeft: 8
		},
		descStar: {
			fontSize: 8,
			marginLeft: 14
		},
		link: {
			fontSize: 8,
			textDecoration: 'underline',
			color: c.primary
		},
		pills: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 2
		},
		pill: {
			fontSize: 8
		},
		contactItem: {
			fontSize: 8,
			color: c.accent
		}
	})

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Dense header */}
				<View style={styles.header}>
					<View style={styles.nameTitle}>
						<Text style={styles.name}>{data.name}</Text>
						<Text style={styles.title}>{data.title}</Text>
						{data.subtitle ? <Text style={styles.subtitle}>{data.subtitle}</Text> : null}
					</View>
					<View style={styles.meta}>
						{data.yearsOfExperience ? (
							<Text style={styles.metaItem}>
								{data.yearsOfExperience}{' '}
								{language === 'en'
									? `${data.yearsOfExperience > 1 ? 'years' : 'year'}`
									: `${data.yearsOfExperience > 1 ? 'années' : 'année'}`}
							</Text>
						) : null}
						{data.languages?.length ? (
							<Text style={styles.metaItem}>
								{data.languages.map(l => l.name).join(' · ')}
							</Text>
						) : null}
					</View>
				</View>

				<View style={styles.body}>
					{/* Sidebar */}
					<View style={styles.sidebar}>
						{data.contact?.length ? (
							<View style={styles.section}>
								<Text style={styles.sectionHeader}>
									{language === 'en' ? 'Contact' : 'Contact'}
								</Text>
								<View style={{ flexDirection: 'column', gap: 2 }}>
									{data.contact
										.filter(cn => cn.value)
										.map(cn =>
											cn.link ? (
												<Link key={cn.key} src={cn.link} style={styles.contactItem}>
													{cn.value}
												</Link>
											) : (
												<Text key={cn.key} style={styles.contactItem}>
													{cn.value}
												</Text>
											)
										)}
								</View>
							</View>
						) : null}

						{(data.skills?.stack && data.skills.stack.length > 0) || (data.skills?.other && data.skills.other.length > 0) ? (
							<View style={styles.section}>
								<Text style={styles.sectionHeader}>
									{language === 'en' ? 'Skills' : 'Compétences'}
								</Text>
								<View style={{ flexDirection: 'column', gap: 6 }}>
									{data.skills?.stack && data.skills.stack.length > 0 ? (
										<View style={{ flexDirection: 'column', gap: 2 }}>
											<Text style={styles.itemTitle}>
												{language === 'en' ? 'Technical Stack' : 'Stack Technique'}
											</Text>
											<View style={{ flexDirection: 'column', gap: 2 }}>
												{data.skills.stack.map((group: { name: string; rating: number | null }[], groupIndex: number) => (
													<View key={groupIndex} style={styles.pills}>
														{group.map((skill: { name: string; rating: number | null }, i: number) => (
															<React.Fragment key={`${skill.name}-${i}`}>
																<Text style={styles.pill}>{skill.name}</Text>
																{i !== group.length - 1 && <Text style={styles.pill}>·</Text>}
															</React.Fragment>
														))}
													</View>
												))}
											</View>
										</View>
									) : null}
									{data.skills?.other && data.skills.other.length > 0 ? (
										<View style={{ flexDirection: 'column', gap: 2 }}>
											<Text style={styles.itemTitle}>
												{language === 'en' ? 'Other Skills' : 'Autres Compétences'}
											</Text>
											<View style={styles.pills}>
												{data.skills.other.map((s: { name: string; rating: number | null }, i: number) => (
													<React.Fragment key={`${s.name}-${i}`}>
														<Text style={styles.pill}>{s.name}</Text>
														{i !== data.skills!.other!.length - 1 && <Text style={styles.pill}>·</Text>}
													</React.Fragment>
												))}
											</View>
										</View>
									) : null}
								</View>
							</View>
						) : null}
					</View>

					{/* Main */}
					<View style={styles.main}>
						{data.experience?.length ? (
							<View style={styles.section}>
								<Text style={styles.sectionHeader}>
									{language === 'en' ? 'Experience' : 'Expérience'}
								</Text>
								<View style={{ flexDirection: 'column', gap: 6 }}>
									{[...data.experience]
										.sort((a, b) => (a.order || 0) - (b.order || 0))
										.map((exp, i) => (
											<View key={i} style={{ flexDirection: 'column', gap: 3 }}>
												<View style={styles.row}>
													<View style={styles.left}>
														<Text style={styles.itemTitle}>
															{exp.place}
														</Text>
														{exp.placeDescription ? (
															<Text style={styles.desc}>{exp.placeDescription}</Text>
														) : null}
														<Text style={styles.period}>{exp.period}</Text>
													</View>
													<View style={styles.right}>
														<Text style={styles.itemTitle}>{exp.title}</Text>
														{exp.description?.map((d, di) => {
															const normalized = d.replace(/^(\*|-)\s?/, '• ')
															return (
																<Text
																	key={di}
																	style={styles.desc}
																>
																	{normalized}
																</Text>
															)
														})}
														{exp.skills?.length ? (
															<View style={{ flexDirection: 'column', gap: 2 }}>
																<Text style={{ fontSize: 8, color: c.accent, fontWeight: 'bold' }}>
																	{language === 'en' ? 'Skills' : 'Compétences'}
																</Text>
																<View style={styles.pills}>
																	{exp.skills!.map((s, si) => (
																		<React.Fragment key={si}>
																			<Text style={styles.pill}>{s}</Text>
																			{si !== exp.skills!.length - 1 && <Text style={styles.pill}>·</Text>}
																		</React.Fragment>
																	))}
																</View>
															</View>
														) : null}
														{exp.link ? (
															<View style={{ marginTop: 2 }}>
																<Link style={styles.link} src={exp.link}>
																	{language === 'en' ? 'More details' : 'Plus de détails'}
																</Link>
															</View>
														) : null}
													</View>
												</View>
											</View>
										))}
								</View>
							</View>
						) : null}

						{data.education?.length ? (
							<View style={styles.section}>
								<Text style={styles.sectionHeader}>
									{language === 'en' ? 'Education' : 'Formation'}
								</Text>
								<View style={{ flexDirection: 'column', gap: 4 }}>
									{data.education.map((edu, i) => (
										<View key={i} style={styles.row}>
											<View style={styles.left}>
												<Text style={styles.itemTitle}>{edu.title}</Text>
												{edu.placeDescription ? (
													<Text style={styles.desc}>{edu.placeDescription}</Text>
												) : null}
												<Text style={styles.period}>{edu.period}</Text>
											</View>
											<View style={styles.right}>
												{edu.description?.map((d, di) => {
													const normalized = d.replace(/^(\*|-)\s?/, '• ')
													return (
														<Text key={di} style={styles.desc}>
															{normalized}
														</Text>
													)
												})}
											</View>
										</View>
									))}
								</View>
							</View>
						) : null}
					</View>
				</View>
			</Page>
		</Document>
	)
}

export const PDFRendererDense = ({ data, language, theme }: PDFDocumentProps) => {
	return (
		<PDFViewer width="100%" height="100%">
			<PDFDocumentDense data={data} language={language} theme={theme} />
		</PDFViewer>
	)
}

export const PDFDocumentRendererDense = ({ data, language, theme }: PDFDocumentProps) => {
	return <PDFDocumentDense data={data} language={language} theme={theme} />
}



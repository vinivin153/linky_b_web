import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { modalActions, MODAL_TYPES } from "store/ducks/modalSlice";
import { useAppDispatch } from "store/Hooks";
import { useMatchDetail } from "utils/hooks/useMatch";

import Button from "components/buttons/Button";
import { Spacing } from "components/spacing";
import { Text } from "components/text";
import { TotalAlertModal } from "containers/Modal/TotalAlertModal";

import { DotMenuIcon } from "components/Icon/Icon";
import MemberInfoContainer from "containers/MemberInfoContainer/MemberInfoContainer";
import { BottomButtonMenu } from "containers/Modals/BottomButtonMenu";
import { StickyFooter } from "containers/StickyFooter";
import { SubHeader } from "containers/SubHeader";
import { Hr } from "styles/Style";
import {
  BlackSelectButton,
  FooterContainer,
  InfoItemContainer,
  InfoWrapper,
  IntroductionWrapper,
  ProfileImage,
  StyledHeader,
  StyledMatchDetail,
} from "./MatchDetail.style";

/**
 * @returns 연결내역 화면 - 사용자 상세조회 화면
 */
const MatchDetail = () => {
  const theme = useTheme();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [showMainModal, setShowMainModal] = useState(false);

  const { userId } = params;
  const { data: user, error, isLoading } = useMatchDetail(userId);

  // UseQuery status에 따른 처리
  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (error) {
    return <span>Error : {error}</span>;
  }
  if (!user) {
    return <span>There is no data!</span>;
  }

  // 데이터 추출
  const {
    userNickname,
    userMajorName,
    userStudentNum,
    userProfileImg,
    userBirth,
    userSex,
    userMBTI,
    userSelfIntroduction,
    getUserPersonalityRes,
    getUserInterestRes,
    userLikeCount,
  } = user;

  // 데이터 전처리. API 스펙에 의존
  const userInterests = getUserInterestRes.map((i) => i.interest);
  const userPersonalities = getUserPersonalityRes.map((p) => p.personality);
  const userInfos = [
    { title: "학과", value: userMajorName },
    { title: "학번", value: userStudentNum },
    { title: "나이", value: userBirth },
    { title: "성별", value: userSex },
    { title: "MBTI", value: userMBTI },
  ];

  // 반복되는 SelectButton 렌더링을 함수화
  const SelectButtonItems = ({ title, items }) => (
    <section>
      <Text color={theme.colors.fontGrey} fontSize={theme.fontSize.xs}>
        {title}
      </Text>
      <Spacing />
      <InfoItemContainer>
        {items.map((item) => (
          <BlackSelectButton key={item}>{item}</BlackSelectButton>
        ))}
      </InfoItemContainer>
      <Spacing />
    </section>
  );

  // Callback Functions
  const onClickApproveButton = () => {
    dispatch(
      modalActions.showModal({
        userId,
        userNickname,
        modalType: MODAL_TYPES.APPROVE,
      }),
    );
  };
  const onClickRejectButton = () => {
    dispatch(
      modalActions.showModal({
        userId,
        userNickname,
        modalType: MODAL_TYPES.REJECT,
      }),
    );
  };

  const toggleMainModal = () => {
    setShowMainModal(!showMainModal);
  };

  return (
    <StyledMatchDetail>
      <TotalAlertModal />

      {showMainModal && (
        <BottomButtonMenu
          userId={userId}
          userNickname={userNickname}
          onClickClose={toggleMainModal}
        />
      )}
      <StyledHeader>
        <SubHeader
          leftChild={
            <MemberInfoContainer
              userNickname={userNickname}
              userLikeCount={userLikeCount}
              userDetail={`${userLikeCount}명과 링크중입니다 `}
              subheader
            />
          }
          rightChild={
            <button onClick={toggleMainModal}>
              <DotMenuIcon />
            </button>
          }
        />
        <ProfileImage src={userProfileImg} alt="" />
      </StyledHeader>

      <article className="MatchDetailArticle">
        <IntroductionWrapper className="userIntroduction">
          <Text fontSize={theme.fontSize.xs} whiteSpace="pre-line">
            {userSelfIntroduction}
          </Text>
        </IntroductionWrapper>

        <InfoWrapper>
          <section className="userInfoSection">
            <Text color={theme.colors.fontGrey} fontSize={theme.fontSize.xs}>
              회원정보
            </Text>
            <Spacing />
            <section className="userInfoContentsSection">
              {userInfos.map(({ title, value }) => {
                return (
                  <InfoItemContainer key={title}>
                    <Text>{title}</Text>
                    <Spacing />
                    <Text fontSize={theme.fontSize.xs}>{value}</Text>
                  </InfoItemContainer>
                );
              })}
            </section>
          </section>

          <Hr />
          <SelectButtonItems title="성격" items={userPersonalities} />
          <Hr />
          <SelectButtonItems title="관심사" items={userInterests} />
        </InfoWrapper>

        <StickyFooter>
          <FooterContainer>
            <Button onClick={onClickRejectButton} color="grey">
              거절하기
            </Button>
            <Spacing />
            <Button onClick={onClickApproveButton}>수락하기</Button>
          </FooterContainer>
        </StickyFooter>
      </article>
    </StyledMatchDetail>
  );
};

export default MatchDetail;
